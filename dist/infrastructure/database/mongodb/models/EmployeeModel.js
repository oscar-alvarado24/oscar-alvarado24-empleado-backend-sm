"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/database/mongodb/models/EmployeeModel.ts
const mongoose_1 = __importStar(require("mongoose"));
const employeeSchema = new mongoose_1.Schema({
    // _id is added automatically by Mongoose.
    // We use 'id' as a virtual in IEmployeeDocument.
    firstName: { type: String, required: true },
    // Assuming 'lastName' in the domain entity maps to 'firstSurName' in existing structure
    // or you decide on a specific field for it. For simplicity, let's use a 'lastName' field here.
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    department: { type: String, required: true }, // Added 'department'
    secondName: { type: String, required: false },
    secondSurName: { type: String, required: false },
    landline: { type: String, required: false },
    descriptionResidence: { type: String, required: false },
    // Add schema definitions for new fields
    address: { type: String, required: true }, // Assuming these are required as per EmployeeProps
    cellPhone: { type: String, required: true },
    residencesType: { type: String, required: true },
    neighborhood: { type: String, required: true },
    empresa: { type: Number, required: true },
    photo: { type: String, required: false },
    // Mongoose adds createdAt and updatedAt automatically if timestamps: true
}, {
    timestamps: true, // Automatically add createdAt and updatedAt
    toJSON: {
        virtuals: true, // Ensure virtuals like 'id' are included in toJSON output
        transform: (doc, ret) => {
            delete ret._id; // Remove _id
            delete ret.__v; // Remove __v
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    }
});
// If your domain Employee entity has fields that are not directly in IEmployeeDocument
// (e.g., 'lastName' vs 'firstSurName'), ensure the mapping logic in your repository
// handles this. The schema should reflect what's stored in MongoDB.
// The model name 'Employee' will be pluralized to 'employees' for the collection name.
exports.default = mongoose_1.default.model('Employee', employeeSchema);
//# sourceMappingURL=EmployeeModel.js.map