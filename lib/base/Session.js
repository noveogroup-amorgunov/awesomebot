'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Session {

    constructor({ initialState }) {
        this.initialState = initialState;
        this.state = Object.assign({}, initialState);
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
exports.default = Session;