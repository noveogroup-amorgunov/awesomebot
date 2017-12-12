'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleConnector = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

require('colors');

var _Message = require('../core/Message');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConsoleConnector extends _events2.default {
    static getConnectorName() {
        return 'console';
    }

    getUniqueSessionKey(rawData) {
        // eslint-disable-line
        return ConsoleConnector.getConnectorName();
    }

    async getUser() {
        return Promise.resolve(this._getUser());
    }

    _getUser() {
        return { id: 'user', name: 'Console User' };
    }

    async send(message) {
        // console.log(`${'Bot says: '.black.bold.bgGreen} ${message}`);
        // $FlowFixMe
        console.log(message.green); // eslint-disable-line
        return Promise.resolve();
    }

    listen() {
        // $FlowFixMe
        const rl = _readline2.default.createInterface(process.stdin, process.stdout);

        rl.on('line', (line = '') => {
            if (line.toLowerCase() === 'quit') {
                rl.close();
                process.exit();
            }

            const msg = new _Message.Message({
                rawData: line,
                text: line,
                user: this._getUser(),
                sessionKey: this.getUniqueSessionKey()
            });

            this.emit('receive-message', msg);
        });

        return this;
    }
}
exports.ConsoleConnector = ConsoleConnector;