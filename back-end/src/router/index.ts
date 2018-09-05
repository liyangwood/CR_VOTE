import {Request, Response, NextFunction, Router} from 'express';
import {getEnv} from '../utility';
import db from '../db';
import {utilCrypto} from '../utility';
import * as moment from 'moment';

import user from './user';
import cvote from './cvote';


export const middleware = (req: Request, res: Response, next: NextFunction)=>{
    // check token
    const token = req.headers['api-token'];

    if(token){
        try{
            const json = JSON.parse(utilCrypto.decrypt(token.toString()));
            if(json.userId && json.expired && (json.expired - moment().unix() > 0)){
                db.create().then((DB)=>{
                    DB.getModel('User').findOne({_id: json.userId}).then((user) => {

                        // TODO: find better way to not send the salt back to the front-end
                        delete user._doc.salt

                        if (user){
                            req['session'].user = user;
                            req['session'].userId = user.id;
                        }

                        next();
                    }).catch(()=>{
                        next();
                    })
                });
                return false;
            }
        }catch(e){
            next();
        }
    }
    else if(req['session'].userId){
        // check session
        const session = req['session'];
        db.create().then((DB)=>{
            DB.getModel('User').findOne({_id: session.userId}).then((user)=>{
                if(user){
                    req['session'].user = user;
                }

                next();
            }).catch(()=>{
                next();
            })
        });
        return false;
    }


    next();
};

const router = Router();


router.use('/user', user);
router.use('/cvote', cvote);

router.use((req, res)=>{
    return res.sendStatus(403);
});

export default router;
