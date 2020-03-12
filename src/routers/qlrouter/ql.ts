import * as express from 'express';
import * as graphlHTTP from 'express-graphql';
import  { ApolloServer } from 'apollo-server-express';

import { QLQuery, QLMutation, QLScala } from './qlresolver';
import { GraphQLSchema} from 'graphql';
import { TRouter } from '../router';
import { ServerEnvironment as SE} from '../../environment';

export class GQLRouter extends TRouter {
    private labelSchema: GraphQLSchema;

    constructor(app:express.Application, options?: express.RouterOptions) {
        super(app, options);
    }

    initialize() {
        return new Promise<boolean>( (resolve) =>{
            try{
                const typeDefs = SE.QLSchema;
                const query = QLQuery.Instance.query;
                const mutation = QLMutation.Instance.mutation;
                const dateScalar  = QLScala.Instance.dateScalar;
                const apsServer = new ApolloServer({
                    typeDefs,
                    resolvers: {Query: query, Mutation: mutation, Date: dateScalar },
                    playground: {
                        endpoint: '/gql',
                        settings: {
                            'editor.theme': 'dark'
                        }
                    }
                });
    
                apsServer.applyMiddleware({ app: this.app, path:'/gq' });
                apsServer.applyMiddleware({ app: this.app, path:'/gql' });
                resolve(true);
            } catch(e){
                console.log('catch', e);
                resolve(false);
            }
        });
    }
}