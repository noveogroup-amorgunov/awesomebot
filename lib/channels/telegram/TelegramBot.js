'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelegramBot = undefined;

var _Bot = require('../../base/Bot');

var _TelegramSession = require('./TelegramSession');

var _TelegramEvent = require('./TelegramEvent');

var _TelegramEvent2 = _interopRequireDefault(_TelegramEvent);

var _TelegramConnector = require('./TelegramConnector');

var _SessionStore = require('../../stores/SessionStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import type {TelegramUser} from './TelegramEvent';
// import type {SessionStateType} from '../../base/SessionStateType';

class TelegramBot extends _Bot.Bot {

    constructor({ connector, sessionStore }) {
        super({ connector, sessionStore });
        this.SessionClass = _TelegramSession.TelegramSession;
        return this;
    }
}
exports.TelegramBot = TelegramBot;