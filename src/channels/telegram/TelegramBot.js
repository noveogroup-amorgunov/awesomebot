/* @flow */

import {Bot} from '../../base/Bot';
import {TelegramSession} from './TelegramSession';
import TelegramEvent from './TelegramEvent';
import {TelegramConnector} from './TelegramConnector';
import {SessionStore} from '../../stores/SessionStore';

// import type {TelegramUser} from './TelegramEvent';
// import type {SessionStateType} from '../../base/SessionStateType';

type TelegramContext = {session: TelegramSession, event: TelegramEvent};
type Middleware = (context?: TelegramContext, next?: Middleware) => {};

type ConstructorOptions = {
    connector: TelegramConnector,
    sessionStore?: SessionStore
}

export class TelegramBot extends Bot {
    connector: TelegramConnector;
    SessionClass = TelegramSession;

    constructor({connector, sessionStore}: ConstructorOptions) {
        super({connector, sessionStore});
        return this;
    }
}
