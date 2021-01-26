import {ERROR_WRONG_CREDENTIALS} from "../constants";

type ErrorType = 'ERROR_WRONG_CREDENTIALS' | 'ERROR_TOO_MANY_ATTEMPTS';

export default class AuthenticationError extends Error {
    private readonly type: ErrorType;
    constructor(type: ErrorType = ERROR_WRONG_CREDENTIALS) {
        super();
        this.type = type;
    }

    getType = () => this.type;
}