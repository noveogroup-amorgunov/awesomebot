/* @flow */

import {Bot} from '../../base/Bot';
import {ConsoleSession} from './ConsoleSession';
import ConsoleEvent from './ConsoleEvent';
import {ConsoleConnector} from './ConsoleConnector';
import {SessionStore} from '../../stores/SessionStore';

import type {SessionStateType} from '../../base/SessionStateType';

type ConsoleContext = {session: ConsoleSession, event: ConsoleEvent};
type Middleware = (context?: ConsoleContext, next?: Middleware) => {};

type ConstructorOptions = {
    connector: ConsoleConnector,
    sessionStore?: SessionStore
}

export class ConsoleBot extends Bot {
    initialState: SessionStateType = {};
    middlewares: Array<Function> = []; // Middleware
    handleError: Function = (err) => {
        console.error(err); // eslint-disable-line
    };
    sessionStore: SessionStore;
    connector: ConsoleConnector;
    SessionClass = ConsoleSession;

    constructor({connector, sessionStore}: ConstructorOptions) {
        super({connector, sessionStore});
        return this;
    }
}
