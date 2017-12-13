/* @flow */

import type {Session} from '../base/SessionInterface';

export interface SessionStoreInterface {
    find(key: string): Promise<Session | null>;
    add(key: string, data: Session): Promise<any>;
    destroy(key: string): Promise<any>;
}
