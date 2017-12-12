/* @flow */

import type {UserType} from '../types/UserType';

export class Message {
    props: any;
    _rawData: ?{} | string;
    text: string;

    constructor({
        rawData,
        text,
        user,
        sessionKey
    }: {rawData: ?{} | string, text: string, user: UserType, sessionKey: string}) {
        this._rawData = rawData;
        this.props = {
            text,
            user,
            sessionKey
        };
        return this;
    }

    getText(): string {
        return this.props.text;
    }

    getUser(): UserType {
        return this.props.user;
    }

    getSessionKey(): string {
        return this.props.sessionKey;
    }
}
