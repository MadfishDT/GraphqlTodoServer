import * as express from 'express';

import { TRouter } from './router';
import { TodoDB } from '../db/db';

export class LabelRouter extends TRouter{
    
    private db: TodoDB;

    constructor(app: express.Application, options?: express.RouterOptions) {
        super(app, options);
        this.db = TodoDB.Instance;
    }

    public async addLabel(data: any) {
        // title color todos
        console.log('add label data is: ', data);
        
        if(!data.hasOwnProperty('color')) {
            data['color'] = 'grey';
        }

        if( data && data.hasOwnProperty('title')) {
            let result = await this.db.model_label.create(data);
            return result;
        }
        return null;
    }

    public async findAll() {
        const query = this.db.model_label.find();
        return query.exec();
    }

    public async findAllPopluation() {
        const query = this.db.model_label.find().populate('todos');
        return query.exec();
    }

    public initialize(): Promise<boolean> {
        return new Promise<boolean>( (resolve, reject) =>{
            try {
                this.router.get('', async (req, res, next) => {
                    const labels = await this.findAll();
                    res.json(labels);
                });
        
                this.router.get('/detail', async (req, res, next) => {
                    const labels = await this.findAllPopluation();
                    res.json(labels);
                });

                this.router.post('/', async (req, res) => {
                    if(req.body) {
                        const label = await this.addLabel(req.body);
                        if(label) {
                            res.status(200).json(label);
                        } else {
                            res.status(406).send('Invalid Request');
                        }
                    } else {
                        res.status(400).send('bad Request');
                    }
                    
                })
                resolve(true);
            } catch(e) {
                reject(false);
            }
        });
    }
}

export default LabelRouter;
