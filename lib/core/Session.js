'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Session {

    constructor({ user, bot, initialState }) {
        this.isNew = true;
        this.message = null;

        this.bot = bot;
        this.initialState = initialState;
        this.state = Object.assign({}, initialState);
        this.user = user;
    }

    getUsername() {
        return this.user.name;
    }

    send(message, options) {
        this.isNew = false;
        return this.bot.connector.send(message, this.user, options);
    }

    resetState() {
        this.state = Object.assign({}, this.initialState);
    }

    setState(state) {
        Object.keys(state).forEach(key => {
            this.state[key] = state[key];
        });
    }
}
exports.Session = Session;