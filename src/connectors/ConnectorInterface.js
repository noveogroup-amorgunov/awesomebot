/* @flow */

import type {UserType} from '../types/UserType';

export interface ConnectorInterface {
    static getConnectorName(): string;
    getUniqueSessionKey(rawData: {}): string;
    getUser(): Promise<UserType>;
    send(message: string): Promise<void>;
    listen(): any;
    on(event: string, handler: Function): any;
    emit(event: string, data: any): any;
}
