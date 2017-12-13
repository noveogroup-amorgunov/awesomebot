'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class TelegramEvent {

    constructor(rawEvent) {
        this.params = [];

        this._rawEvent = rawEvent;
    }

    isMessage() {
        return !!this._rawEvent.message;
    }

    isText() {
        return this.isMessage() && typeof this.message.text === 'string';
    }

    get message() {
        return this._rawEvent.message;
    }

    get rawEvent() {
        return this._rawEvent;
    }

    get text() {
        if (this.isText()) {
            return this.message.text;
        }
        return null;
    }

    isCallbackQuery() {
        return !!this.callbackQuery && typeof this.callbackQuery === 'object';
    }

    get callbackQuery() {
        return this._rawEvent.callback_query || null;
    }

    isPayload() {
        return this.isCallbackQuery();
    }

    get payload() {
        if (this.isPayload()) {
            return this.callbackQuery.data;
        }
        return null;
    }
}
exports.default = TelegramEvent;