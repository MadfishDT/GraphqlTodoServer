
import * as mongoose from 'mongoose';
import { LABELMODEL } from './model/model_label';
import { TODOMODEL } from './model/model_todo';
import { USERMODEL, sUserSchema } from './model/model_user';

// connect to MongoDB
export class TodoDB {

    private bInitialize: boolean = false;
    private static default: TodoDB;
    private db: mongoose.Connection;
    constructor() {

    }
    public static get Instance(): TodoDB {
        if (!TodoDB.default) {
            TodoDB.default = new TodoDB();
        }
        return TodoDB.default;
    }
    public get dbConnection() {
        return this.db;
    }
    public async initialize(): Promise<boolean> {
        try{
            await mongoose.connect('mongodb://localhost:27017/mad-todos',
            { useNewUrlParser: true, useUnifiedTopology: true });
            this.db = mongoose.connection;
            this.bInitialize = true;
            return true;
        } catch(e) {
            console.log(e);
            this.bInitialize = false;
            return false;
        }
    }

    public get model_label(): mongoose.Model<mongoose.Document> {
        if(!this.bInitialize) {
            return null;
        }
        return LABELMODEL;
    }

    public get model_todo(): mongoose.Model<mongoose.Document> {
        if(!this.bInitialize) {
            return null;
        }
        return TODOMODEL;
    }

    public get model_user(): mongoose.Model<mongoose.Document> {
        if(!this.bInitialize) {
            return null;
        }
        return USERMODEL;
    }
    public get scheme_user(): mongoose.Schema {
        if(!this.bInitialize) {
            return null;
        }
        return sUserSchema;
    }

}

export default TodoDB
