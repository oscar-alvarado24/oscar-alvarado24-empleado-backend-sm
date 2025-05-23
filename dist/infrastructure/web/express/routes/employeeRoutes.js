"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/web/express/routes/employeeRoutes.ts
const express_1 = require("express");
exports.default = (employeeController) => {
    const router = (0, express_1.Router)();
    router.post('/', (req, res, next) => employeeController.create(req, res, next));
    router.get('/:id', (req, res, next) => employeeController.getById(req, res, next));
    router.get('/', (req, res, next) => employeeController.getAll(req, res, next));
    router.put('/:id', (req, res, next) => employeeController.update(req, res, next));
    router.delete('/:id', (req, res, next) => employeeController.delete(req, res, next));
    return router;
};
//# sourceMappingURL=employeeRoutes.js.map