/* @flow */

import type {SessionStateType} from '../../base/SessionStateType';
import type {TelegramClient} from './TelegramConnector';
import type {TelegramUser} from './TelegramEvent';
import type {Session as SessionInterface} from '../../base/SessionInterface';
import Session from '../../base/Session';

type ConstructorOptions = {
    user: TelegramUser,
    client: TelegramClient,
    initialState: SessionStateType,
    sessionKey: string,
    state?: SessionStateType,
    isNew?: boolean,
    connector: any,
}

export class TelegramSession extends Session implements SessionInterface {
    _client: TelegramClient;
    _connector: any;
    state: SessionStateType;
    initialState: SessionStateType;
    isNew: boolean = true;
    user: TelegramUser;

    constructor(opts: ConstructorOptions) {
        super(opts);
        this._client = opts.client;
        this.user = opts.user;
    }

    getUsername(): string {
        return this.user.first_name;
    }

    async send(text: string, options: ?{}) {
        this.isNew = false;
        return this._client.sendText(this.user.id, text, options);
    }

    async answerCallbackQuery(callbackQueryId: string, text: string) {
        return this._client.answerCallbackQuery(callbackQueryId, text);
    }

    async editMessageReplyMarkup(...args: any) {
        return this._client.editMessageReplyMarkup(...args);
    }

    async typing(milliseconds: number): Promise<void> {
        return this._client.typing(milliseconds);
    }
}
