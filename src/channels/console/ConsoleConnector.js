/* @flow */

import EventEmitter from 'events';
import readline from 'readline';
import 'colors';
import type {ConnectorInterface} from '../../base/ConnectorInterface';
import ConsoleEvent, {type ConsoleRawEvent} from './ConsoleEvent';
import sleep from '../../utils/delay';

type ConsoleRequestBody = ConsoleRawEvent;

export type ConsoleClient = {
    sendText(text: string): Promise<void>,
    typing(milliseconds: number): Promise<void>,
};

/* type ConstructorOptions = {|
  client?: ConsoleClient,
|}; */

export type ConsoleUser = {
    id: number,
    name: string,
}

export class ConsoleConnector extends EventEmitter implements ConnectorInterface<ConsoleRequestBody> {
    static getConnectorName(): string {
        return 'console';
    }

    _client: ConsoleClient;

    constructor() {
        super();
        this._client = {
            sendText: (text) => {
                // $FlowFixMe
                process.stdout.write(`${'Bot'.green.bold} > ${text}`);
                process.stdout.write('\nYou > ');
                return Promise.resolve();
            },
            async typing(milliseconds) {
                if (milliseconds > 0) {
                    await sleep(milliseconds);
                }
            }
        };
    }

    getUniqueSessionKey() { return ConsoleConnector.getConnectorName(); }

    async getUser(): Promise<ConsoleUser> {
        return Promise.resolve(this._getUser());
    }

    _getUser(): ConsoleUser {
        return {id: 1, name: 'Console User'};
    }

    get client(): ConsoleClient {
        return this._client;
    }

    listen() {
        // $FlowFixMe
        const rl = readline.createInterface(process.stdin, process.stdout);

        process.stdout.write('You > ');

        rl.on('line', (line: string = '') => {
            if (line.toLowerCase() === 'quit') {
                rl.close();
                process.exit();
            }

            const event = new ConsoleEvent({message: {text: line}});

            const user = this._getUser();
            const sessionKey = this.getUniqueSessionKey();

            this.emit('receive-message', {event, user, sessionKey});
        });

        return this;
    }
}
