import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeDocument extends Document<number, {}, IEmployeeDocument> {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  secondName?: string;
  landline?: string;
  descriptionResidence?: string;
  createdAt?: Date;
  updatedAt?: Date;
  address: string;
  cellPhone: string;
  residencesType: string;
  neighborhood: string;
  company: number;
  workplace: string;
  specialty?: string;
  photo?: string;
  active?: boolean;
}

const employeeSchema = new Schema<IEmployeeDocument>({
  _id: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  secondName: { type: String, required: false },
  landline: { type: String, required: false },
  descriptionResidence: { type: String, required: false },
  address: { type: String, required: true },
  cellPhone: { type: String, required: true },
  residencesType: { type: String, required: true },
  neighborhood: { type: String, required: true },
  company: { type: Number, required: true },
  workplace: { type: String, required: true },
  specialty: { type: String, required: false },
  photo: { type: String, required: false },
  active: { type: Boolean, required: false, default: true }
}, {
  timestamps: true,
  _id: false,
  toJSON: {
    transform: (_doc, ret) => {
      delete (ret as { __v?: number }).__v;
    }
  },
  toObject: {
    transform: (_doc, ret) => {
      delete (ret as { __v?: number }).__v;
    }
  }
});

export default mongoose.model<IEmployeeDocument>('Employee', employeeSchema);
