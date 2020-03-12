import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';

import * as passport from 'passport';

import { TodoDB } from './db/db';
import { LabelRouter, UserRouter, GQLRouter } from './routers/routers'
import { ServerEnvironment as SE, SERVERENV as SEV } from './environment';

import * as figlet from 'figlet';
import * as printmessage from 'print-message';

class App {

    public app: express.Application;

    public static bootstrap(): App {
        return new App();
    }

    public static getFiglet(text: string): Promise<string> {
        return new Promise<string>( resolve => {
            figlet(text, (err, data) => {
                if (!err) {
                   resolve(data);
                } else {
                   resolve(null);
                }
            });
        })
      
    }

    constructor() {
        try {
            SE.Instance.setEnvironment(process.argv[2]);
            this.app = express();
        } catch (e) {
            throw 'Server Star Error';
        }
    }

    public routerInitialize(): Promise<any> {
        
        return new Promise( async (resolve ,reject) => {
            const mongoStore: connectMongo.MongoStoreFactory = connectMongo(session);
            this.app.use(session({
                secret: '1&sxsrf=ACYBGNQV0uEqJftscaZXSLZJHMJE',
                resave: true,
                cookie: {
                    maxAge: 1000 * 60 * 10 // 10 min expire time
                },
                saveUninitialized:true,
                rolling: true,
                store: new mongoStore({
                    mongooseConnection: TodoDB.Instance.dbConnection
                })
            }));

            this.app.get('/', (req, res) => {
                res.send('this is Todo Server server');
            });

            this.app.use(passport.initialize());
            this.app.use(passport.session());
            
            const labelRouter = new LabelRouter(this.app);
            const userRouter = new UserRouter(this.app);
            const qlRouter = new GQLRouter(this.app);
           
            const labelRouterResult = await labelRouter.initialize();
            const userRouterResult = await userRouter.initialize();
            const qlRouterResult = await qlRouter.initialize();

            if(labelRouterResult && userRouterResult && qlRouterResult) {
                this.app.use('/label',labelRouter.TRouter);
                this.app.use('/user', userRouter.TRouter);
                resolve();
            } else {
                reject();
               printmessage(['initialize router error'], {border: true, color: 'red'});
            }
        });
    }

    private dbInitialize(): Promise<any> {
        return new Promise( async (resolve, reject) => {
            let result = await TodoDB.Instance.initialize();
            if (result) {
                resolve();
            } else {
             printmessage(['initialize db error'], {border: true, color: 'red'});
                reject();
            }
        });
    }
    
    private expressInitialize(): Promise<any> {
        return new Promise( (resolve ,reject) => {
            this.app.listen(SE.Instance.port, async () => {
               // printmessage([`pack server port open ${SE.Instance.port}`], {border: true, color: 'green'});
                resolve(true);
            })
            .on('error', err =>{
                printmessage(['initialize express error'], {border: true, color: 'red'});
                reject();
            });
        });
    }
    
    public async initialize(): Promise<any> {
        const title = await App.getFiglet(`Pack Server ${SE.Instance.env}: PID: ${SE.clusterNumber}`);
        console.log(title);

        this.app.use(morgan(SE.Instance.env));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(cors(SE.Instance.cors));
 
        return this.expressInitialize()
        .then( () => this.dbInitialize())
        .then( () => this.routerInitialize());
    }
}

export default App;