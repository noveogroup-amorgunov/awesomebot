/* @flow */

import compose from 'koa-compose';
import {TelegramSession} from './TelegramSession';
import type {TelegramUser} from './TelegramEvent';
import TelegramEvent from './TelegramEvent';
import {TelegramConnector} from './TelegramConnector';
import {SessionStore} from '../../stores/SessionStore';

import type {SessionStateType} from '../../base/SessionStateType';

type TelegramContext = {session: TelegramSession, event: TelegramEvent};
type Middleware = (context?: TelegramContext, next?: Middleware) => {};

type ProcessEventData = {
    event: TelegramEvent,
    sessionKey: string,
    user: TelegramUser
}

export class TelegramBot {
    initialState: SessionStateType = {};
    middlewares: Array<Function> = []; // Middleware
    handleError: Function = (err) => {
        console.error(err); // eslint-disable-line
    };
    sessionStore: SessionStore;
    connector: TelegramConnector;

    constructor({connector}: {connector: TelegramConnector}) {
        this.connector = connector;
        this.sessionStore = new SessionStore();
        this.connector.on('receive-message', data => this.processEvent(data));
        return this;
    }

    setInitialState(initialState: SessionStateType) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares: Array<Middleware>, context: TelegramContext) {
        const func = compose(middlewares);
        return func(context);
    }

    async processEvent({event, sessionKey, user}: ProcessEventData) {
        let session: TelegramSession;
        // $FlowFixMe
        session = await this.sessionStore.find(sessionKey);
        if (!session) {
            session = new TelegramSession({
                user,
                client: this.connector.client,
                initialState: Object.assign({}, this.initialState)
            });
            await this.sessionStore.add(sessionKey, session);
        }

        const middlewares = [...this.middlewares];
        // $FlowFixMe
        const context: TelegramContext = {session, event};

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, context)
            .catch(this.handleError.bind(this, context));
    }

    onText(text: string | RegExp, middleware: Middleware) {
        return this.use(text, middleware);
    }

    isExucateMiddleware(ctx: TelegramContext, pattern: string | RegExp) {
        if (ctx.event.isText()) {
            const {text} = ctx.event;
            if (pattern instanceof RegExp) {
                const match = (text: any).match(pattern);
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
