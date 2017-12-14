/* @flow */
/* eslint-disable import/first */

import EventEmitter from 'events';
import type {ConnectorInterface} from '../../base/ConnectorInterface';
import TelegramEvent, {type TelegramRawEvent} from './TelegramEvent';
import type {TelegramUser} from './TelegramEvent';
import sleep from '../../utils/delay';

process.env.NTBA_FIX_319 = 'true';
const NodeTelegramBotApi = require('node-telegram-bot-api');

export type TelegramRequestBody = TelegramRawEvent;

export type TelegramClient = {
    sendText(userId: number, text: string, options: ?{}): Promise<void>,
    answerCallbackQuery(callbackQueryId: string, text: string): Promise<void>,
    editMessageReplyMarkup(props: any, props2: any): Promise<void>;
    typing(milliseconds: number): Promise<void>,
    on(eventType: string, handler: Function): void
};

type ConstructorOptions = {|
  client?: TelegramClient,
  token: string,
  options?: any
|};

export class TelegramConnector extends EventEmitter implements ConnectorInterface<TelegramRequestBody> {
    static getConnectorName(): string {
        return 'telegram';
    }

    _client: TelegramClient;
    _nodeTelegramBotApi: any;

    constructor({token, options = {polling: true}}: ConstructorOptions) {
        super();
        const _nodeTelegramBotApi = new NodeTelegramBotApi(token, options);

        this._client = {
            async sendText(userId, text, opts) {
                return _nodeTelegramBotApi.sendMessage(userId, text, opts);
            },
            async answerCallbackQuery(callbackQueryId, text) {
                return _nodeTelegramBotApi.answerCallbackQuery(callbackQueryId, text);
            },
            async typing(milliseconds) {
                if (milliseconds > 0) {
                    await sleep(milliseconds);
                }
            },
            async editMessageReplyMarkup(...args) {
                return _nodeTelegramBotApi.editMessageReplyMarkup(...args);
            },
            on(...args) {
                return _nodeTelegramBotApi.on(...args);
            }
        };
    }

    getUniqueSessionKey(rawData: TelegramRequestBody): string {
        return TelegramConnector.getConnectorName() + this.getUser(rawData).id;
    }

    getUser(rawData: TelegramRequestBody): TelegramUser {
        let user = {id: 0, first_name: 'Telegram user'};
        if (rawData.message !== undefined) {
            user = rawData.message.from;
        } else if (rawData.callback_query !== undefined) {
            user = rawData.callback_query.from;
        }
        return user;
    }

    get client(): TelegramClient {
        return this._client;
    }

    listen() {
        const handler = (isCallbackQuery = false) => async (rawBody) => {
            const fieldKey = isCallbackQuery ? 'callback_query' : 'message';
            const rawEvent: TelegramRequestBody = {update_id: 1, [fieldKey]: rawBody};
            // console.log(rawEvent);
            const event = new TelegramEvent(rawEvent);
            const user = await this.getUser(rawEvent);
            const sessionKey = this.getUniqueSessionKey(rawEvent);

            this.emit('receive-message', {event, user, sessionKey});
        };

        this._client.on('message', handler());
        this._client.on('callback_query', handler(true));
        return this;
    }
}

/*
class TelegramConnector extends EventEmitter {
    _send(msg) {
        if (msg) {
            this.messageQueue.push(msg);
        }

        if (this.isSendSomeMessage) {
            return;
        }

        const message = this.messageQueue.shift();
        this.isSendSomeMessage = true;
        message.method.bind(this.bot)(...message.data).then(() => {
            this.isSendSomeMessage = false;
            if (this.messageQueue.length > 0) {
                setTimeout(() => this._send(), 0);
            }
        });
    }

    sendButtons(message, user, data) {
        log.info(`[telegram::sendButtons] to user ${user.id} message: ${message}, data: ${JSON.stringify(data)}`);
        if (!message) {
            return;
        }
        const keyboard = data.map(item => ([{ text: item.text }]));

        return this._send({
            method: this.bot.sendMessage,
            data: [user.id, message, { parse_mode: 'Markdown', reply_markup: { one_time_keyboard: true, keyboard } }],
        });
    }

    send(message, user, options = {}) {
        log.info(`[telegram::send] to user ${user.id} message: ${message}`);

        if (!message) {
            return;
        }

        if (message.type === 'sticker') {
            return this.bot.sendSticker(user.id, 'CAADAgADhwEAAs-71A7JxOYStMbA2wI');
        }
        const opts = Object.assign({}, options, { parse_mode: 'Markdown' });
        return this._send({
            method: this.bot.sendMessage,
            data: [user.id, message, opts],
        });
    }

    sendLocation(user, latitude, longitude) {
        return this._send({
            method: this.bot.sendLocation,
            data: [user.id, latitude, longitude],
        });
    }

    sendPhoto(user, photoUrl, text, options = {}) {
        return this._send({
            method: this.bot.sendPhoto,
            data: [user.id, photoUrl, Object.assign({}, options, { caption: text, parse_mode: 'Markdown' })],
        });
    }
}
*/