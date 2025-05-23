"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCognitoUserError = void 0;
class CreateCognitoUserError extends Error {
    constructor(message) {
        super(message);
        this.name = "CreateCognitoUserError";
        this.message = message;
    }
}
exports.CreateCognitoUserError = CreateCognitoUserError;
//# sourceMappingURL=CreateCognitoUserError.js.map