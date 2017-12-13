/* @flow */

export interface EventInterface {
    +_rawEvent: ?{};
    +message: ?{};
    +text: ?string;
    isMessage(): boolean;
    isText(): boolean;
    params?: string[];
}
