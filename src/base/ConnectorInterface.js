/* @flow */

export interface ConnectorInterface<T> {
    static getConnectorName(): string;
    getUniqueSessionKey(rawData: T): string;
    getUser(rawData: any): any;
    // updateSession(session: Session, body: B): Promise<void>;
    // send(message: string): Promise<void>;
    listen(): any;
    on(event: string, handler: Function): any;
    emit(event: string, data: any): any;
}
