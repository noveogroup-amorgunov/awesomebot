'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelegramSession = undefined;

var _Session = require('../../base/Session');

var _Session2 = _interopRequireDefault(_Session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TelegramSession extends _Session2.default {

    constructor({ user, client, initialState }) {
        super({ initialState });
        this.isNew = true;
        this._client = client;
        this.user = user;
    }

    getUsername() {
        return this.user.first_name;
    }

    async send(text, options) {
        this.isNew = false;
        return this._client.sendText(this.user.id, text, options);
    }

    async answerCallbackQuery(callbackQueryId, text) {
        return this._client.answerCallbackQuery(callbackQueryId, text);
    }

    async editMessageReplyMarkup(...args) {
        return this._client.editMessageReplyMarkup(...args);
    }

    async typing(milliseconds) {
        return this._client.typing(milliseconds);
    }
}
exports.TelegramSession = TelegramSession;