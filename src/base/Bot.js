/* @flow */

import compose from 'koa-compose';
import {SessionStore} from '../stores/SessionStore';

import type {EventInterface} from './EventInterface';
import type {Session as SessionInterface} from './SessionInterface';
import type {ConnectorInterface} from './ConnectorInterface';

import type {SessionStateType} from './SessionStateType';

type Context = {session: SessionInterface, event: EventInterface};
type Middleware = (context?: Context, next?: Middleware) => {};

type ProcessEventData = {
    event: EventInterface,
    sessionKey: string,
    user: any
}

type ConstructorOptions = {
    connector: ConnectorInterface<any>,
    sessionStore?: SessionStore
}

export class Bot {
    initialState: SessionStateType = {};
    middlewares: Array<Function> = []; // Middleware
    handleError: Function = (err) => {
        console.error(err); // eslint-disable-line
    };
    sessionStore: SessionStore;
    connector: any;
    SessionClass: any;

    constructor({connector, sessionStore}: ConstructorOptions) {
        this.connector = connector;
        this.sessionStore = sessionStore || new SessionStore();

        this.connector.on('receive-message', data => this.processEvent(data));
        this.connector.on('update-session', data => this.updateSession(data));

        return this;
    }

    setInitialState(initialState: SessionStateType) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares: Array<Middleware>, context: Context) {
        const func = compose(middlewares);
        return func(context);
    }

    async updateSession({key, session}: {key: string, session: any}) {
        // $FlowFixMe
        return this.sessionStore.update(key, session);
    }

    async processEvent({event, sessionKey, user}: ProcessEventData) {
        const sessionData: any = await this.sessionStore.find(sessionKey);
        const session = new this.SessionClass({
            sessionKey,
            client: this.connector.client,
            initialState: Object.assign({}, this.initialState),
            user: (sessionData && sessionData.user) || user,
            state: sessionData && sessionData.state,
            isNew: sessionData && sessionData.isNew,
            connector: this.connector,
        });

        if (!sessionData) {
            await this.sessionStore.add(sessionKey, session.toJSON());
        }

        const middlewares = [...this.middlewares];
        // $FlowFixMe
        const context: Context = {session, event};

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, context)
            .catch(this.handleError.bind(this, context));
    }

    onText(text: string | RegExp, middleware: Middleware) {
        return this.use(text, middleware);
    }

    isExucateMiddleware(ctx: Context, pattern: string | RegExp) {
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
