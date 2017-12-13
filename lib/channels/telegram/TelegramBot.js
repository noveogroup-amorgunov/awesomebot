'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelegramBot = undefined;

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _TelegramSession = require('./TelegramSession');

var _TelegramEvent = require('./TelegramEvent');

var _TelegramEvent2 = _interopRequireDefault(_TelegramEvent);

var _TelegramConnector = require('./TelegramConnector');

var _SessionStore = require('../../stores/SessionStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TelegramBot {

    constructor({ connector }) {
        this.initialState = {};
        this.middlewares = [];

        this.handleError = err => {
            console.error(err); // eslint-disable-line
        };

        this.connector = connector;
        this.sessionStore = new _SessionStore.SessionStore();
        this.connector.on('receive-message', data => this.processEvent(data));
        return this;
    } // Middleware


    setInitialState(initialState) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares, context) {
        const func = (0, _koaCompose2.default)(middlewares);
        return func(context);
    }

    async processEvent({ event, sessionKey, user }) {
        let session;
        // $FlowFixMe
        session = await this.sessionStore.find(sessionKey);
        if (!session) {
            session = new _TelegramSession.TelegramSession({
                user,
                client: this.connector.client,
                initialState: Object.assign({}, this.initialState)
            });
            await this.sessionStore.add(sessionKey, session);
        }

        const middlewares = [...this.middlewares];
        // $FlowFixMe
        const context = { session, event };

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, context).catch(this.handleError.bind(this, context));
    }

    onText(text, middleware) {
        return this.use(text, middleware);
    }

    isExucateMiddleware(ctx, pattern) {
        if (ctx.event.isText()) {
            const { text } = ctx.event;
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

    use(patternOrMiddleware, _middleware) {
        const middleware = _middleware || patternOrMiddleware;
        const pattern = _middleware ? patternOrMiddleware : null;
        if (typeof middleware !== 'function') {
            throw new Error('Middleware should be function');
        }

        if (pattern) {
            this.middlewares.push((ctx, next) => {
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

    catch(handler) {
        this.handleError = handler;
    }
}
exports.TelegramBot = TelegramBot;