
import * as cluster from 'cluster';
import * as path from 'path';
import * as fs from 'fs';

export enum SERVERENV {
    DEV = 'dev',
    PROD = 'prod'
}

export enum SERVERPORTS {
    DEV = 3001,
    PROD = 3003
};

const corsDevOptions = {
    'origin': ['http://localhost:3000', 'http://localhost:3001'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'credentials': true,
    'optionsSuccessStatus': 204
};

const corsProdOptions = {
    'origin': ['http://localhost:3000', 'http://localhost:8081'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'credentials': true,
    'optionsSuccessStatus': 204
};

export class ServerEnvironment {

    private envServer: SERVERENV;
    private portServer: SERVERPORTS;
    private corsServer: any;
    
    private static default: ServerEnvironment;
    private static qlSchema: string;

    public static clusterNumberServer: any;

    constructor() {
        this.envServer = SERVERENV.DEV;
        this.portServer = SERVERPORTS.DEV;
        this.corsServer = corsDevOptions;
        
    }
    public static get QLSchema(): string {
        if(!ServerEnvironment.qlSchema) {
            ServerEnvironment.qlSchema = ServerEnvironment.getQLSchema();
        }
        return ServerEnvironment.qlSchema;
    }
    public static get Instance(): ServerEnvironment {
        if (!ServerEnvironment.default) {
            ServerEnvironment.default = new ServerEnvironment();
            if(cluster.worker) {
                ServerEnvironment.clusterNumberServer = cluster.worker.process.pid;
            }       
        }
        return ServerEnvironment.default;
    }

    public static get clusterNumber() {
        if(ServerEnvironment.clusterNumberServer){
            return ServerEnvironment.clusterNumberServer;
        } else {
            return -1;
        }
           
    }

    public setEnvironment(env: string): void {
        if(env) {
            if(env === 'prod' || env === 'live')  {
                this.envServer = SERVERENV.PROD;
                this.portServer = SERVERPORTS.PROD;
                this.corsServer = corsProdOptions;
            }
        }
        this.envServer = SERVERENV.DEV;
        this.portServer = SERVERPORTS.DEV;
        this.corsServer = corsDevOptions;
    }
    
    public get cors(): any {
        return this.corsServer;
    }
    
    public get port(): SERVERPORTS {
        return this.portServer;
    }
    
    public get env(): SERVERENV {
        return this.envServer;
    }

    public static getQLSchema(): string | null{
        try {
            const buffer = fs.readFileSync(path.join(process.cwd(), 'qlschema/schema.graphql'), 'utf8');
            return buffer;
        } catch(e) {
            return null;
        }
    }

}

export default ServerEnvironment;
