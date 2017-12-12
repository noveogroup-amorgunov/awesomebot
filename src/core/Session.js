/* @flow */

import type {SessionStateType} from '../types/SessionStateType';
import type {UserType} from '../types/UserType';

export class Session {
    bot: any;
    state: SessionStateType;
    initialState: SessionStateType;
    isNew: boolean = true;
    user: UserType;

    constructor({user, bot, initialState}: {user: UserType, bot: any, initialState: SessionStateType}) {
        this.bot = bot;
        this.initialState = initialState;
        this.state = Object.assign({}, initialState);
        this.user = user;
    }

    getUsername(): string {
        return this.user.name;
    }

    send(message: string, options: any) {
        this.isNew = false;
        return this.bot.connector.send(message, this.user, options);
    }

    resetState(): void {
        this.state = Object.assign({}, this.initialState);
    }

    setState(state: SessionStateType): void {
        Object.keys(state).forEach((key) => {
            this.state[key] = state[key];
        });
    }
}
