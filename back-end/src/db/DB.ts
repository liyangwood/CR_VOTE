import * as mongoose from 'mongoose';
import User from './User';
import CVote from './CVote';


import {utilCrypto} from '../utility';
import * as uuid from 'uuid'

export default class {
    protected db: any;
    public connection: mongoose.ConnectionBase;

    constructor(){
        this.db = {};
    }

    public isConnected(): boolean{
        return this.connection && this.connection.readyState === 1;
    }

    public async start(): Promise<mongoose.ConnectionBase>{
        const url = process.env.DB_URL;
        const db = await mongoose.createConnection(url);
        this.connection = db;

        // Setup callback
        this.connection.on('error', this.handleDBError);

        this.connection.on('disconnected', this.handleUnexpectedDisconnect);

        this.connection.on('reconnected', function () {
            console.log('MongoDB reconnected!');
        });

        this.initDB(db);
    

        // await this.prepareRecord();

        return db;
    }

    private handleDBError() {

        return (error: any) => {

            console.log('Error is happenning', error);
        };
    }

    private handleUnexpectedDisconnect() {

        console.log('handleUnexpectedDisconnect')

        return (error: any) => {

            console.error('mongodb is disconnect', error);
            setTimeout(() => {
                this.start();
            }, 5000);
        };
    }

    public disconnect() {
        mongoose.connection.close()
    }

    private async initTest(){
        const u = await this.db.Test.find({});
        if(u.length < 1){
            const rs = await this.db.Test.save({
                name : 'test',
                age : 100,
                time : Date.now()
            });
        }
    }

    private initDB(db){
        this.db.User = new User(db);
        this.db.CVote = new CVote(db);
        
    }

    public getModel(name: string){
        const rs = this.db[name];
        if(!rs){
            throw new Error('invalid model name : '+name);
        }
        return rs;
    }

    private async prepareRecord(){
        // create admin user
        const salt = uuid.v4();
        const password = utilCrypto.sha512(process.env.ADMIN_PASSWORD+salt);
        const doc = {
            username: process.env.ADMIN_USERNAME,
            password,
            salt,
            email: 'admin@ebp.com',
            role: 'ADMIN',
            active: true,
            profile: {
                firstName: 'Admin',
                lastName: 'Ebp',
                region: {
                    country: 'China',
                    city: ''
                }
            }
        };
        try{
            const rs = await this.db.User.save(doc);
            console.log('create admin user =>', rs);
        }catch(err){
            if(err.code === 11000){
                console.log('admin user already exists');
            }
            else{
                console.error(err);
            }
        }
    }
}
