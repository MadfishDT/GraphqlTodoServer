import * as express from 'express';

export class TRouter{
    protected router: express.Router;
    protected app: express.Application;

    constructor(app: express.Application, options?: express.RouterOptions) {
        this.router = express.Router(options);
        this.app = app;
    }
    get TRouter(): express.Router {
        return this.router;
    }
    get TApp(): express.Application {
        return this.app;
    }
}

export default TRouter;
