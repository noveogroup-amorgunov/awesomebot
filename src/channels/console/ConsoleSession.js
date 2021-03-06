/* @flow */

import type {SessionStateType} from '../../base/SessionStateType';
import type {ConsoleClient, ConsoleUser} from './ConsoleConnector';
import type {Session as SessionInterface} from '../../base/SessionInterface';
import Session from '../../base/Session';

type ConstructorOptions = {
    user: ConsoleUser,
    client: ConsoleClient,
    initialState: SessionStateType,
    sessionKey: string,
    state?: SessionStateType,
    isNew?: boolean,
    connector: any,
}

export class ConsoleSession extends Session implements SessionInterface {
    _client: ConsoleClient;
    state: SessionStateType;
    initialState: SessionStateType;
    isNew: boolean = true;
    user: ConsoleUser;

    constructor(opts: ConstructorOptions) {
        super(opts);
        this._client = opts.client;
        this.user = opts.user;
    }

    getUsername(): string {
        return this.user.name;
    }

    async send(text: string) {
        this.isNew = false;
        this._client.sendText(text);
        return Promise.resolve();
    }

    async typing(milliseconds: number): Promise<void> {
        return this._client.typing(milliseconds);
    }
}
