/* @flow */

import compose from 'koa-compose';
import {Session} from './Session';
import {Message} from './Message';
import {SessionStore} from '../stores/SessionStore';

import type {SessionType} from '../types/SessionType';
import type {SessionStateType} from '../types/SessionStateType';
import type {ConnectorInterface} from '../connectors/ConnectorInterface';

export class Bot {
    initialState: SessionStateType = {};
    middlewares: Array<Function> = [];
    handleError: Function = (err) => {
        console.error(err); // eslint-disable-line
    };
    sessionStore: SessionStore;
    connector: ConnectorInterface;

    constructor({connector}: {connector: ConnectorInterface}) {
        this.connector = connector;
        this.sessionStore = new SessionStore();

        this.connector.on('receive-message', msg => this.processMessage(msg));

        return this;
    }

    setInitialState(initialState: SessionStateType) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares: Array<Function>, context: {session: SessionType, message: any}) {
        const func = compose(middlewares);
        return func(context);
    }

    async processMessage(message: Message) {
        const key = message.getSessionKey();
        let session = await this.sessionStore.find(key);
        if (!session) {
            session = new Session({
                user: message.getUser(),
                bot: this,
                initialState: Object.assign({}, this.initialState)
            });
            await this.sessionStore.add(key, session);
        }

        const middlewares = [...this.middlewares];
        const context = {session, message};

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, context)
            .catch(this.handleError.bind(this, context));
    }

    onText(text: string | RegExp, middleware: Function) {
        return this.use(text, middleware);
    }

    use(regexpOrMiddleware: Function | RegExp | string, _middleware : Function) {
        const middleware: Function = _middleware || regexpOrMiddleware;
        if (typeof middleware !== 'function') {
            throw new Error('Middleware should be function');
        }
        if (regexpOrMiddleware instanceof RegExp) {
            this.middlewares.push((ctx, next) => {
                const text = ctx.message.getText();
                const match = text.match(regexpOrMiddleware);
                if (match) {
                    ctx.message.params = match.length > 1 ? match.slice(1) : null;
                    return middleware(ctx, next);
                }
                return next();
            });
        } else if (typeof regexpOrMiddleware === 'string') {
            this.middlewares.push((ctx, next) => {
                const text = ctx.message.getText();
                if (text === regexpOrMiddleware) {
                    return middleware(ctx, next);
                }
                return next();
            });
        } else {
            this.middlewares.push(middleware);
        }
    }

    listen() {
        return this.connector.listen();
    }

    catch(handler: Function) {
        this.handleError = handler;
    }
}
