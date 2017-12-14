'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleBot = undefined;

var _Bot = require('../../base/Bot');

var _ConsoleSession = require('./ConsoleSession');

var _ConsoleEvent = require('./ConsoleEvent');

var _ConsoleEvent2 = _interopRequireDefault(_ConsoleEvent);

var _ConsoleConnector = require('./ConsoleConnector');

var _SessionStore = require('../../stores/SessionStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConsoleBot extends _Bot.Bot {
    // Middleware
    constructor({ connector, sessionStore }) {
        super({ connector, sessionStore });
        this.initialState = {};
        this.middlewares = [];

        this.handleError = err => {
            console.error(err); // eslint-disable-line
        };

        this.SessionClass = _ConsoleSession.ConsoleSession;
        return this;
    }
}
exports.ConsoleBot = ConsoleBot;