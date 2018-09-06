import Base from './Base';
import {Document} from 'mongoose';
import * as _ from 'lodash';
import {constant} from '../constant';
import * as uuid from 'uuid'
import {validate, utilCrypto, mail} from '../utility';

const map_key = ['Kevin Zhang', 'Fay Li', 'Yipeng Su'];

export default class extends Base {

    public async create(param): Promise<Document>{

        const db_cvote = this.getDBModel('CVote');

        if(!this.currentUser || !this.currentUser._id){
            throw 'invalid current user';
        }

        const {
            title, type, content, proposedBy, motionId, isConflict, notes, vote_map, reason_map
        } = param;
        const doc: any = {
            title, 
            type, 
            content,
            proposedBy,
            motionId,
            isConflict,
            notes,
            vote_map : this.param_metadata(vote_map),
            reason_map : this.param_metadata(reason_map),
            createdBy : this.currentUser._id
        };

        const vid = await this.getNewVid();
        doc.vid = vid;
        doc.status = this.getNewStatus(doc.vote_map);

        const cvote = await db_cvote.save(doc);
        return cvote;
    }

    public async list(param): Promise<Document>{
        const db_cvote = this.getDBModel('CVote');
        const db_user = this.getDBModel('User');

        const query = {};
        const list = await db_cvote.list(query, {
            updatedAt: -1
        }, 100);
        
        for(let item of list){
            if(item.createdBy){
                const u = await db_user.findOne({_id : item.createdBy});
                item.createdBy = u.username;
            }
            
        }

        return list;
    }
    public async update(param): Promise<Document>{
        const db_cvote = this.getDBModel('CVote');

        if(!this.currentUser || !this.currentUser._id){
            throw 'invalid current user';
        }

        const cur = await db_cvote.findOne({_id : param._id});
        if(!cur){
            throw 'invalid proposal id';
        }
        if(cur.status === 'success' || cur.status === 'fail'){
            throw 'proposal finished, can not edit anymore';
        }

        const {
            title, type, content, proposedBy, motionId, isConflict, notes, vote_map, reason_map
        } = param;
        const doc: any= {
            title, 
            type, 
            content,
            proposedBy,
            motionId,
            isConflict,
            notes,
            vote_map : this.param_metadata(vote_map),
            reason_map : this.param_metadata(reason_map)
        };

        doc.status = this.getNewStatus(doc.vote_map);

        const cvote = await db_cvote.update({_id : param._id}, doc);
        
        return cvote;
    }
    public async getById(id): Promise<any>{
        const db_cvote = this.getDBModel('CVote');
        const rs = await db_cvote.findOne({_id : id});
        return rs;
    }

    private param_metadata(meta: string){
        const rs = {};
        if(meta){
            const list = meta.split(',');

            _.each(list, (str)=>{
                const tmp = str.split('|');
                if(tmp.length === 2){
                    rs[tmp[0]] = tmp[1];
                }
            });
        }
        return rs;
    }

    public async getNewVid(){
        const db_cvote = this.getDBModel('CVote');
        const n = await db_cvote.count({});
        return n+1;
    }

    public getNewStatus(vote_map){
        let rs = '';
        let ns = 0;
        let nf = 0;
        _.each(vote_map, (v)=>{
            if(v === 'support'){
                ns++;
            }
            else if(v === 'reject'){
                nf++;
            }
        });
        if(nf > 1){
            rs = 'fail';
        }
        if(ns > 1){
            rs = 'success';
        }

        return rs;
    }

}
