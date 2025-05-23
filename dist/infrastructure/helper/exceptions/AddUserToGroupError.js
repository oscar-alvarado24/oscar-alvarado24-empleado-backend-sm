"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserToGroupError = void 0;
class AddUserToGroupError extends Error {
    constructor(message) {
        super(message);
        this.name = "AddUserToGroupError";
        this.message = message;
    }
}
exports.AddUserToGroupError = AddUserToGroupError;
//# sourceMappingURL=AddUserToGroupError.js.map