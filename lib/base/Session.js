'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Session {

    constructor({ initialState, state, sessionKey, isNew, connector }) {
        this.initialState = initialState;
        this.sessionKey = sessionKey;
        this.state = state || Object.assign({}, initialState);
        this.isNew = !!isNew;
        this._connector = connector;
    }

    resetState() {
        this.state = Object.assign({}, this.initialState);
        this._connector.emit('update-session', { key: this.sessionKey, session: this.toJSON() });
    }

    setState(state) {
        Object.keys(state).forEach(key => {
            this.state[key] = state[key];
        });
        this._connector.emit('update-session', { key: this.sessionKey, session: this.toJSON() });
    }

    toJSON() {
        return {
            isNew: this.isNew,
            state: this.state,
            user: this.user,
            id: this.sessionKey
        };
    }
}
exports.default = Session;