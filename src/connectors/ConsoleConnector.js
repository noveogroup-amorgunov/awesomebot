/* @flow */

import EventEmitter from 'events';
import readline from 'readline';
import 'colors';
import {Message} from '../core/Message';
import type {UserType} from '../types/UserType';
import type {ConnectorInterface} from './ConnectorInterface';

export class ConsoleConnector extends EventEmitter implements ConnectorInterface {
    static getConnectorName(): string {
        return 'console';
    }

    getUniqueSessionKey(rawData: any) { // eslint-disable-line
        return ConsoleConnector.getConnectorName();
    }

    async getUser(): Promise<UserType> {
        return Promise.resolve(this._getUser());
    }

    _getUser(): UserType {
        return {id: 'user', name: 'Console User'};
    }

    async send(message: string) {
        // console.log(`${'Bot says: '.black.bold.bgGreen} ${message}`);
        // $FlowFixMe
        console.log(message.green); // eslint-disable-line
        return Promise.resolve();
    }

    listen() {
        // $FlowFixMe
        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.on('line', (line: string = '') => {
            if (line.toLowerCase() === 'quit') {
                rl.close();
                process.exit();
            }

            const msg = new Message({
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
