"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
class EmployeeController {
    constructor(createEmployeeHandler) {
        this.createEmployeeHandler = createEmployeeHandler;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeDTO = {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    secondName: req.body.secondName,
                    firstSurName: req.body.firstSurName,
                    secondSurName: req.body.secondSurName,
                    address: req.body.address,
                    landline: req.body.landline,
                    cellPhone: req.body.cellPhone,
                    residencesType: req.body.residencesType,
                    descriptionResidence: req.body.descriptionResidence,
                    neighborhood: req.body.neighborhood,
                    position: req.body.position,
                    empresa: req.body.empresa
                };
                // Pasar el DTO al handler
                const result = yield this.createEmployeeHandler.createEmployee(employeeDTO);
                res.status(201).json({
                    message: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=EmployeeController.js.map