import * as express from 'express';
import { TRouter } from './router';
import { TodoDB } from '../db/db';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt-nodejs';

export class UserRouter extends TRouter {

    private db: TodoDB;

    constructor(app: express.Application, options?: express.RouterOptions) {
        super(app, options);
        this.db = TodoDB.Instance;
    }
    private checkPassword(guess: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            bcrypt.compare(guess, password, (err, isMatch) => {
                err ? resolve(false) : resolve(isMatch);
            });
        });
    };

    public loginInitialize(): void {
        const stragyForm = { // local 전략을 세움
            usernameField: 'userEmail',
            passwordField: 'password',
            session: true
        }

        passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
            done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
        });

        passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
            done(null, user); // 여기의 user가 req.user가 됨
        });

        passport.use('login', new Strategy(stragyForm, async (email, password, done) => {
            const query = this.db.model_user.findOne({ userEmail: email });
            const userFindResult = await query.exec() as any;
            if (userFindResult) {
                let result = await this.checkPassword(password, userFindResult.password);
                if (result) {
                    done(null, userFindResult);
                } else {
                    done(null, null, { message: 'Invalid user.' });
                }
            } else {
                done(null, null, { message: 'Invalid user.' });
            }
        }));
    }

    public initialize(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.loginInitialize();
                this.router.post('/login', (req, res, next) => {
                    passport.authenticate('login', (error, user, info) => {
                        req.login(user, (loginError: any) => {
                            if (!error && req.user) {
                                res.setHeader('Access-Control-Allow-Credentials', 'true');
                                res.type('json');
                                res.json(req.user);
                            } else {
                                res.status(401).send('invalid user');
                            }
                        });
                    })(req, res, next);
                })

                this.router.get('/session', (req, res) => {
                    if (req.isAuthenticated()) {
                        res.type('json');
                        res.json({
                            userName: req.user['userName']
                        });
                    } else {
                        res.status(401).send('not logined user');;
                    }
                });

                this.router.get('/sessionout', (req, res) => {
                    if (req.isAuthenticated()) {
                        req.logout();
                    }
                    res.sendStatus(200).clearCookie('connect.sid');
                });
                resolve(true);
            } catch (e) {
                reject(false);
            }
        });
    }
}

export default UserRouter;
