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

var _ConsoleEvent = require('./ConsoleEvent');

var _ConsoleEvent2 = _interopRequireDefault(_ConsoleEvent);

var _delay = require('../../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* type ConstructorOptions = {|
  client?: ConsoleClient,
|}; */

class ConsoleConnector extends _events2.default {
    static getConnectorName() {
        return 'console';
    }

    constructor() {
        super();
        this._client = {
            sendText: text => {
                // $FlowFixMe
                process.stdout.write(`${'Bot'.green.bold} > ${text}`);
                process.stdout.write('\nYou > ');
                return Promise.resolve();
            },
            async typing(milliseconds) {
                if (milliseconds > 0) {
                    await (0, _delay2.default)(milliseconds);
                }
            }
        };
    }

    getUniqueSessionKey() {
        return ConsoleConnector.getConnectorName();
    }

    async getUser() {
        return Promise.resolve(this._getUser());
    }

    _getUser() {
        return { id: 1, name: 'Console User' };
    }

    get client() {
        return this._client;
    }

    listen() {
        // $FlowFixMe
        const rl = _readline2.default.createInterface(process.stdin, process.stdout);

        process.stdout.write('You > ');

        rl.on('line', (line = '') => {
            if (line.toLowerCase() === 'quit') {
                rl.close();
                process.exit();
            }

            const event = new _ConsoleEvent2.default({ message: { text: line } });

            const user = this._getUser();
            const sessionKey = this.getUniqueSessionKey();

            this.emit('receive-message', { event, user, sessionKey });
        });

        return this;
    }
}
exports.ConsoleConnector = ConsoleConnector;