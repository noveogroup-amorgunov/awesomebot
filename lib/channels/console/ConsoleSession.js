'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleSession = undefined;

var _Session = require('../../base/Session');

var _Session2 = _interopRequireDefault(_Session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConsoleSession extends _Session2.default {

    constructor(opts) {
        super(opts);
        this.isNew = true;
        this._client = opts.client;
        this.user = opts.user;
    }

    getUsername() {
        return this.user.name;
    }

    async send(text) {
        this.isNew = false;
        this._client.sendText(text);
        return Promise.resolve();
    }

    async typing(milliseconds) {
        return this._client.typing(milliseconds);
    }
}
exports.ConsoleSession = ConsoleSession;