/* @flow */

import compose from 'koa-compose';
import {ConsoleSession} from './ConsoleSession';
import ConsoleEvent from './ConsoleEvent';
import {ConsoleConnector, type ConsoleUser} from './ConsoleConnector';
import {SessionStore} from '../../stores/SessionStore';

import type {SessionStateType} from '../../base/SessionStateType';

type ConsoleContext = {session: ConsoleSession, event: ConsoleEvent};
type Middleware = (context?: ConsoleContext, next?: Middleware) => {};

type ProcessEventData = {
    event: ConsoleEvent,
    sessionKey: string,
    user: ConsoleUser
}

export class ConsoleBot {
    initialState: SessionStateType = {};
    middlewares: Array<Function> = []; // Middleware
    handleError: Function = (err) => {
        console.error(err); // eslint-disable-line
    };
    sessionStore: SessionStore;
    connector: ConsoleConnector;

    constructor({connector}: {connector: ConsoleConnector}) {
        this.connector = connector;
        this.sessionStore = new SessionStore();

        this.connector.on('receive-message', data => this.processEvent(data));

        return this;
    }

    setInitialState(initialState: SessionStateType) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares: Array<Middleware>, context: ConsoleContext) {
        const func = compose(middlewares);
        return func(context);
    }

    async processEvent({event, sessionKey, user}: ProcessEventData) {
        let session: ConsoleSession;
        // $FlowFixMe
        session = await this.sessionStore.find(sessionKey);
        if (!session) {
            session = new ConsoleSession({
                user,
                client: this.connector.client,
                initialState: Object.assign({}, this.initialState)
            });
            await this.sessionStore.add(sessionKey, session);
        }

        const middlewares = [...this.middlewares];
        // $FlowFixMe
        const context: ConsoleContext = {session, event};

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, context)
            .catch(this.handleError.bind(this, context));
    }

    onText(text: string | RegExp, middleware: Middleware) {
        return this.use(text, middleware);
    }

    isExucateMiddleware(ctx: ConsoleContext, pattern: string | RegExp) {
        if (ctx.event.isText()) {
            const {text} = ctx.event;
            if (pattern instanceof RegExp) {
                const match = text.match(pattern);
                if (match) {
                    ctx.event.params = match.length > 1 ? match.slice(1) : [];
                    return true;
                }
            } else if (typeof pattern === 'string') {
                if (text === pattern) {
                    return true;
                }
            }
        }
        return false;
    }

    use(patternOrMiddleware: Function | RegExp | string, _middleware : Function) {
        const middleware: Function = _middleware || patternOrMiddleware;
        const pattern = _middleware ? patternOrMiddleware : null;
        if (typeof middleware !== 'function') {
            throw new Error('Middleware should be function');
        }

        if (pattern) {
            this.middlewares.push((ctx, next: Function) => {
                if (this.isExucateMiddleware(ctx, pattern)) {
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
