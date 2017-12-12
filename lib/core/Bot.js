'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bot = undefined;

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _Session = require('./Session');

var _Message = require('./Message');

var _SessionStore = require('../stores/SessionStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bot {

    constructor({ connector }) {
        this.initialState = {};
        this.middlewares = [];

        this.handleError = err => {
            console.error(err); // eslint-disable-line
        };

        this.connector = connector;
        this.sessionStore = new _SessionStore.SessionStore();

        this.connector.on('receive-message', msg => this.processMessage(msg));

        return this;
    }

    setInitialState(initialState) {
        this.initialState = initialState;
    }

    async processMiddlewares(middlewares, session, message) {
        const func = (0, _koaCompose2.default)(middlewares);
        const context = { session, message };
        return func(context);
    }

    async processMessage(message) {
        const key = message.getSessionKey();
        let session = await this.sessionStore.find(key);
        if (!session) {
            session = new _Session.Session({
                user: message.getUser(),
                bot: this,
                initialState: Object.assign({}, this.initialState)
            });
            await this.sessionStore.add(key, session);
        }

        const middlewares = [...this.middlewares];

        /**
         * Run incoming middlewares
         */
        this.processMiddlewares(middlewares, session, message).catch(this.handleError);
    }

    onText(text, middleware) {
        return this.use(text, middleware);
    }

    use(regexpOrMiddleware, _middleware) {
        const middleware = _middleware || regexpOrMiddleware;
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

    catch(handler) {
        this.handleError = handler;
    }
}
exports.Bot = Bot;