"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoutes = void 0;
const express_1 = require("express");
const EmployeeRoutes = (employeeController) => {
    const router = (0, express_1.Router)();
    router.post('/create', employeeController.create.bind(employeeController));
    return router;
};
exports.EmployeeRoutes = EmployeeRoutes;
//# sourceMappingURL=EmployeeRoutes.js.map