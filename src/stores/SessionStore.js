/* @flow */

import type {SessionStoreInterface} from './SessionStoreInterface';
import type {SessionType} from '../types/SessionType';

export class SessionStore implements SessionStoreInterface {
    _store: { [string]: SessionType } = {};

    async find(key: string) {
        return Promise.resolve(this._store[key]);
    }

    async add(key: string, data: SessionType) {
        this._store[key] = data;
        return Promise.resolve();
    }

    async destroy(key: string) {
        delete this._store[key];
        return Promise.resolve();
    }
}
