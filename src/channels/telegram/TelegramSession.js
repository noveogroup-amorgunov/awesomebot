/* @flow */

import type {SessionStateType} from '../../base/SessionStateType';
import type {TelegramClient} from './TelegramConnector';
import type {TelegramUser} from './TelegramEvent';
import type {Session as SessionInterface} from '../../base/SessionInterface';
import Session from '../../base/Session';

type ConstructorOptions = {
    user: TelegramUser,
    client: TelegramClient,
    initialState: SessionStateType
}

export class TelegramSession extends Session implements SessionInterface {
    _client: TelegramClient;
    state: SessionStateType;
    initialState: SessionStateType;
    isNew: boolean = true;
    user: TelegramUser;

    constructor({user, client, initialState}: ConstructorOptions) {
        super({initialState});
        this._client = client;
        this.user = user;
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
