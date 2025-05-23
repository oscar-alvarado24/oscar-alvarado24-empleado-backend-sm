"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ValidationError_1 = require("../../../../applicaion/handler/exceptions/ValidationError");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ValidationError_1.ValidationError) {
        // Error de aplicación (traducido del dominio)
        res.status(400).json({
            error: err.message,
        });
    }
    else {
        // Errores no controlados
        res.status(500).json({
            error: "Error interno del servidor",
        });
    }
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=MiddlewareError.js.map