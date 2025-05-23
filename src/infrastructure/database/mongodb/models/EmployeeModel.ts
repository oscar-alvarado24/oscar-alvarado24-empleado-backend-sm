// src/infrastructure/database/mongodb/models/EmployeeModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Employee } // Assuming this is the path to your domain entity
  from '../../../../domain/entities/Employee'; // Adjust path as needed

// Interface for the Mongoose Document
// It should include all fields from your Employee domain entity
// plus any Mongoose-specific fields like _id, createdAt, updatedAt if you use timestamps.
export interface IEmployeeDocument extends Document {
  id: string; // Mongoose uses 'id' as a virtual getter for '_id'.
  firstName: string;
  lastName: string; // Assuming lastName corresponds to firstSurName or a combination
  email: string;
  position: string;
  department: string;
  secondName?: string;
  secondSurName?: string;
  landline?: string;
  descriptionResidence?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Add missing fields from EmployeeProps
  address: string;
  cellPhone: string;
  residencesType: string;
  neighborhood: string;
  empresa: number;
  photo?: string;
}

const employeeSchema = new Schema<IEmployeeDocument>({
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
export default mongoose.model<IEmployeeDocument>('Employee', employeeSchema);
