"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
exports.stringToEnum = stringToEnum;
var Position;
(function (Position) {
    Position["DOCTOR"] = "DOCTOR";
    Position["ASSITANT"] = "ASSITANT";
    Position["ADMIN"] = "ADMIN";
    Position["MANAGER"] = "MANAGER";
    Position["MEDICINE_DISPENSER"] = "MEDICINE DISPENSER";
    Position["DISPENSARY_MANAGER"] = "DISPENSARY MANAGER";
})(Position || (exports.Position = Position = {}));
function stringToEnum(value) {
    if (Object.values(Position).includes(value)) {
        return value;
    }
    throw new Error(`El valor de "${value}" no es una opción válida para una posición`);
}
//# sourceMappingURL=Position.js.map