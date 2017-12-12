/* @flow */

import type {SessionStateType} from './SessionStateType';

export type SessionType = {
    bot: any;
    state: SessionStateType;
    initialState: SessionStateType;
    isNew: boolean;
    getUsername(): string;
    send(message: string, options: any): Promise<any>;
    resetState(): void;
    setState(state: SessionStateType): void;
}
