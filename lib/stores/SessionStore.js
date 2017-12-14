'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class SessionStore {
    constructor() {
        this._store = {};
    }

    async find(key) {
        return Promise.resolve(this._store[key]);
    }

    async add(key, data) {
        this._store[key] = data;
        return Promise.resolve();
    }

    async update(key, data) {
        this._store[key] = data;
        return Promise.resolve();
    }

    async destroy(key) {
        delete this._store[key];
        return Promise.resolve();
    }
}
exports.SessionStore = SessionStore;