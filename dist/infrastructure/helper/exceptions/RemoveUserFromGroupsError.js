"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveUserFromGroupsError = void 0;
class RemoveUserFromGroupsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RemoveUserFromGroupsError';
        this.message = message;
    }
}
exports.RemoveUserFromGroupsError = RemoveUserFromGroupsError;
//# sourceMappingURL=RemoveUserFromGroupsError.js.map