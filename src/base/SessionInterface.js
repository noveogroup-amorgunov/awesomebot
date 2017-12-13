/* @flow */

import type { EventInterface as Event } from './EventInterface';

export interface Session {
    _client: any;
    // event: ?Event;
    +state: ?{};
    +isNew: boolean;
    +send: (text: string) => any;
}
