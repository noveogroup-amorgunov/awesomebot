/* @flow */

import { MongoClient } from 'mongodb';
import type {SessionStoreInterface} from './SessionStoreInterface';
import type {Session} from '../base/SessionInterface';

type MongoCollection = {
  findOne: (filter: {}) => Promise<Session | null>,
  updateOne: (filter: {}, data: {}, options: {}) => Promise<{}>,
  remove: (filter: {}) => Promise<void>,
}

type MongoConnection = {
  collection: (name: string) => MongoCollection,
}

export class MongoSessionStore implements SessionStoreInterface {
    _uri: string;
    _collectionName: string;
    _db: ?MongoConnection;
    _connection: ?{ db: () => {}};

    constructor(uri: string, options: { collectionName?: string } = {}) {
        this._uri = uri;
        this._collectionName = options.collectionName || 'sessions';
    }

    connect() {
        return MongoClient.connect(this._uri).then((client) => {
            this._connection = client;
            this._db = client.db('cat-test');
        });
    }

    getSessionCollection(): MongoCollection {
        if (!this._db) {
            throw new Error('MongoSessionStore: must call `connect` method to connect to mongodb.');
        }
        return (this._db: any).collection(this._collectionName);
    }

    async find(key: string): Promise<any> {
        const data = await this.getSessionCollection().findOne({id: key});
        if (data) {
            return Promise.resolve(data);
        }
        return null;
    }

    async update(key: string, data: {}): Promise<void> {
        await this.getSessionCollection().updateOne({id: key}, {$set: data}, {upsert: true});
    }

    async add(key: string, data: {}): Promise<void> {
        await this.getSessionCollection().updateOne({id: key}, {$set: data}, {upsert: true});
    }

    async destroy(key: string): Promise<void> {
        return this.getSessionCollection().remove({id: key});
    }
}
