/* @flow */

import type {SessionStoreInterface} from './SessionStoreInterface';
import type {Session} from '../base/SessionInterface';

export class SessionStore implements SessionStoreInterface {
    _store: { [string]: Session } = {};

    async find(key: string): Promise<Session | null> {
        return Promise.resolve(this._store[key]);
    }

    async add(key: string, data: Session) {
        this._store[key] = data;
        return Promise.resolve();
    }

    async update(key: string, data: Session) {
        this._store[key] = data;
        return Promise.resolve();
    }

    async destroy(key: string) {
        delete this._store[key];
        return Promise.resolve();
    }
}
