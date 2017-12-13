/* @flow */

import type {EventInterface} from '../../base/EventInterface';

export type TelegramUser = {
    id: number,
    first_name: string,
    last_name?: string,
    username?: string,
    language_code?: string,
}

type Photo = Array<{
    file_id: string,
    width: number,
    height: number,
}>

type Audio = {
    file_id: string,
    width: number,
    height: number,
}

type Document = {
    file_id: string,
}

type Sticker = {
    file_id: string,
    width: number,
    height: number,
};

type Video = {
    file_id: string,
    width: number,
    height: number,
    duration: number,
};

type Voice = {
    file_id: string,
    duration: number,
}

type VideoNote = {
    file_id: string,
    length: number,
    duration: number,
}

type Contact = {
    phone_number: string,
    first_name: string,
}

type Location = {|
    longitude: number,
    latitude: number,
|}

type Venue = {
    location: Location,
    title: string,
    address: string,
}

type File = {
    file_id: string,
}

type Game = {
    title: string,
    description: string,
    photo: Array<{
        file_id: string,
        width: number,
        height: number,
    }>,
}

type Message = {
    message_id: number,
    from: TelegramUser,
    chat: {
      id: number,
      first_name: string,
      last_name: string,
      type: 'private',
    },
    date: number,
    text: string,
    entities: Array<{
      type: 'bot_command',
      offset: number,
      length: number,
    }>,
    photo?: Photo,
    game?: Game,
    audio?: Audio,
    document?: Document,
    sticker?: Sticker,
    video?: Video,
    voice?: Voice,
    video_note?: VideoNote,
    contact?: Contact,
    location?: Location,
    venue?: Venue,
    file?: File,
}

type CallbackQuery = {
    from: TelegramUser,
    message: Message,
    chat_instance: string,
    data: string,
}

export type TelegramRawEvent = {
    update_id: number,
    message?: Message,
    callback_query?: CallbackQuery,
}

export default class TelegramEvent implements EventInterface {
    _rawEvent: TelegramRawEvent;
    params = [];

    constructor(rawEvent: TelegramRawEvent) {
        this._rawEvent = rawEvent;
    }

    isMessage(): boolean {
        return !!this._rawEvent.message;
    }

    isText(): boolean {
        return this.isMessage() && typeof (this.message: any).text === 'string';
    }

    get message(): ?Message {
        return this._rawEvent.message;
    }

    get rawEvent(): TelegramRawEvent {
        return this._rawEvent;
    }

    get text(): ?string {
        if (this.isText()) {
            return (this.message: any).text;
        }
        return null;
    }

    isCallbackQuery(): boolean {
        return !!this.callbackQuery && typeof this.callbackQuery === 'object';
    }


    get callbackQuery(): ?CallbackQuery {
        return this._rawEvent.callback_query || null;
    }

    isPayload(): boolean {
        return this.isCallbackQuery();
    }

    get payload(): ?string {
        if (this.isPayload()) {
            return (this.callbackQuery: any).data;
        }
        return null;
    }
}
