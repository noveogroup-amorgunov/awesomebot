import type {SessionStateType} from '../base/SessionStateType';

export default class Session {
    state: SessionStateType;
    initialState: SessionStateType;

    constructor({initialState}) {
        this.initialState = initialState;
        this.state = Object.assign({}, initialState);
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
