'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ConsoleEvent {

    constructor(rawEvent) {
        this.params = [];

        this._rawEvent = rawEvent;
    }

    isMessage() {
        return true;
    }

    isText() {
        return true;
    }

    get message() {
        return this._rawEvent.message;
    }

    get rawEvent() {
        return this._rawEvent;
    }

    get text() {
        return this.message.text;
    }
}
exports.default = ConsoleEvent;