/* @flow */

import type {SessionStateType} from '../base/SessionStateType';

type ConstructorOptions = {
    initialState: SessionStateType,
    sessionKey: string,
    state?: SessionStateType,
    isNew?: boolean;
    connector: any;
}


export default class Session {
    state: SessionStateType;
    initialState: SessionStateType;
    sessionKey: string;
    _client: any;
    isNew: boolean;
    user: any;
    _connector: any;

    constructor({initialState, state, sessionKey, isNew, connector}: ConstructorOptions) {
        this.initialState = initialState;
        this.sessionKey = sessionKey;
        this.state = state || Object.assign({}, initialState);
        this.isNew = !!isNew;
        this._connector = connector;
    }

    resetState(): void {
        this.state = Object.assign({}, this.initialState);
        this._connector.emit('update-session', {key: this.sessionKey, session: this.toJSON()});
    }

    setState(state: SessionStateType): void {
        Object.keys(state).forEach((key) => {
            (this.state: any)[key] = state[key];
        });
        this._connector.emit('update-session', {key: this.sessionKey, session: this.toJSON()});
    }

    toJSON() {
        return {
            isNew: this.isNew,
            state: this.state,
            user: this.user,
            id: this.sessionKey,
        };
    }
}
