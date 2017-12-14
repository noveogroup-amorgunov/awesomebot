'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MongoSessionStore = undefined;

var _mongodb = require('mongodb');

class MongoSessionStore {

    constructor(uri, options = {}) {
        this._uri = uri;
        this._collectionName = options.collectionName || 'sessions';
    }

    connect() {
        return _mongodb.MongoClient.connect(this._uri).then(client => {
            this._connection = client;
            this._db = client.db('cat-test');
        });
    }

    getSessionCollection() {
        if (!this._db) {
            throw new Error('MongoSessionStore: must call `connect` method to connect to mongodb.');
        }
        return this._db.collection(this._collectionName);
    }

    async find(key) {
        const data = await this.getSessionCollection().findOne({ id: key });
        if (data) {
            return Promise.resolve(data);
        }
        return null;
    }

    async update(key, data) {
        await this.getSessionCollection().updateOne({ id: key }, { $set: data }, { upsert: true });
    }

    async add(key, data) {
        await this.getSessionCollection().updateOne({ id: key }, { $set: data }, { upsert: true });
    }

    async destroy(key) {
        return this.getSessionCollection().remove({ id: key });
    }
}
exports.MongoSessionStore = MongoSessionStore;