'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Message {

    constructor({
        rawData,
        text,
        user,
        sessionKey
    }) {
        this._rawData = rawData;
        this.props = {
            text,
            user,
            sessionKey
        };
        return this;
    }

    getText() {
        return this.props.text;
    }

    getUser() {
        return this.props.user;
    }

    getSessionKey() {
        return this.props.sessionKey;
    }
}
exports.Message = Message;