"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ApplicationError";
        this.message = message;
    }
}
exports.ApplicationError = ApplicationError;
//# sourceMappingURL=ApplicationError.js.map