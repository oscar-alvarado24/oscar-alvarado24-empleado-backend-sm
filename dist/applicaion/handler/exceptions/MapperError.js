"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapperError = void 0;
class MapperError extends Error {
    constructor(message) {
        super(message);
        this.name = "MapperError";
        this.message = message;
    }
}
exports.MapperError = MapperError;
//# sourceMappingURL=MapperError.js.map