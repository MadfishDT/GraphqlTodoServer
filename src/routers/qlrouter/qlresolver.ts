import { argsToArgsConfig } from "graphql/type/definition";
import { Kind } from 'graphql/language';
import { TodoDB } from '../../db/db';
import { Query } from "mongoose";

export class QLScala {
    private static default: QLScala;

    constructor() {
    }

    public static get Instance(): QLScala {
        if (!QLScala.default) {
            QLScala.default = new QLScala();
        }
        return QLScala.default;
    }
    
    get dateScalar() {
        return {
            __parseValue(value) {
              return new Date(value); // value from the client
            },
            __serialize(value) {
              return value.getTime(); // value sent to the client
            },
            __parseLiteral(ast) {
              if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
              }
              return null;
            }
          }
    }
}
export class QLQuery {
    
    private db: TodoDB;

    constructor() {
        this.db = TodoDB.Instance;
    }
    private static default: QLQuery;

    public static get Instance(): QLQuery {
        if (!QLQuery.default) {
            QLQuery.default = new QLQuery();
        }
        return QLQuery.default;
    }
   
    get query() {
        return {
            labels: async (obj, args, context, info) => {
                const query = this.db.model_label.find();
                const result = await query.exec();
                console.log(result);
                return result;
            },
            test: () => {
                return {
                    name: 'aaa',
                    id: 'bbb',
                    desc: 'cccc',
                }
            }
        }
    } 
}

export class QLMutation {
    private db: TodoDB;
    constructor() {
        this.db = TodoDB.Instance;
    }
    private static default: QLMutation;

    public static get Instance(): QLMutation {
        if (!QLMutation.default) {
            QLMutation.default = new QLMutation();
        }
        return QLMutation.default;
    }

    get mutation() {
        return {
            createUser: (obj,args, context, info): string =>{
                return args;
            },
            createLabel: async (obj, args, context, info) => {

                let colorValue: string;
                if(args.hasOwnProperty('title')) {
                    const titleValue = args.title;
                    const descValue = args.desc ? args.desc : '';
                    if(!args.hasOwnProperty('color')){
                        colorValue = '#000066';
                    } else {
                        colorValue = args.color;
                    }
                    const resultQuery = await this.db.model_label.create({
                        title: titleValue,
                        desc: descValue,
                        color: colorValue
                    });
                    if(resultQuery) {
                        return true;
                    }
                }
                return false;
            }
        }
    } 
}