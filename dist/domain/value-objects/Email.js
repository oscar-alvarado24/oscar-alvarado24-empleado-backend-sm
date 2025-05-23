"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const validator_1 = __importDefault(require("validator"));
class Email {
    constructor(email) {
        if (!Email.isValid(email)) {
            throw new Error('Invalid email format');
        }
        this.value = validator_1.default.normalizeEmail(email) || email;
    }
    static create(email) {
        return new Email(email);
    }
    static isValid(email) {
        return validator_1.default.isEmail(email, {
            allow_utf8_local_part: true,
            require_tld: true
        });
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map