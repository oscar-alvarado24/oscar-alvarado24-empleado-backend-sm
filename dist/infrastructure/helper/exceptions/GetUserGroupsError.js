"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserGroupsError = void 0;
class GetUserGroupsError extends Error {
    constructor(message) {
        super(message);
        this.name = "GetUserGroupsError";
        this.message = message;
    }
}
exports.GetUserGroupsError = GetUserGroupsError;
//# sourceMappingURL=GetUserGroupsError.js.map