/* @flow */

import type {EventInterface} from '../../base/EventInterface';

type Message = {
  text: string,
};

export type ConsoleRawEvent = {
  message: Message,
};

export default class ConsoleEvent implements EventInterface {
    _rawEvent: ConsoleRawEvent;
    params = [];

    constructor(rawEvent: ConsoleRawEvent) {
        this._rawEvent = rawEvent;
    }

    isMessage(): boolean {
        return true;
    }

    isText(): boolean {
        return true;
    }

    get message(): Message {
        return this._rawEvent.message;
    }

    get rawEvent(): ConsoleRawEvent {
        return this._rawEvent;
    }

    get text(): string {
        return this.message.text;
    }
}
