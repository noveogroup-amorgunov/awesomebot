/* @flow */

import type {SessionType} from '../types/SessionType';

export interface SessionStoreInterface {
    find(key: string): Promise<SessionType | null>;
    add(key: string, data: SessionType): Promise<any>;
    destroy(key: string): Promise<any>;
}
