"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserError = void 0;
class DeleteUserError extends Error {
    constructor(message) {
        super(message);
        this.name = "DeleteUserError";
        this.message = message;
    }
}
exports.DeleteUserError = DeleteUserError;
//# sourceMappingURL=DeleteUserError.js.map