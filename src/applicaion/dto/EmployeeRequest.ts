import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose} from 'class-transformer';


export class EmployeeRequest {
  @Expose() 
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNotEmpty()
  firstName: string;

  @Expose()
  secondName?: string;

  @Expose()
  @IsNotEmpty()
  firstSurName: string;

  @Expose()
  secondSurName?: string;

  @Expose()
  @IsNotEmpty()
  address: string;

  @Expose()
  landline?: string;

  @Expose()
  @IsNotEmpty()
  cellPhone: string;

  @Expose() 
  @IsNotEmpty()
  residencesType: string;

  @Expose()
  descriptionResidence?: string;

  @Expose()
  @IsNotEmpty()
  neighborhood: string;

  @Expose()
  @IsNotEmpty()
  position: string;

  @Expose()
  @IsNotEmpty()
  empresa: number;

  @Expose()
  @IsNotEmpty()
  department: string; // Added department
  
  constructor(data: { 
    email: string; 
    firstName: string; 
    firstSurName: string; 
    cellPhone: string; 
    address: string; 
    residencesType: string; 
    neighborhood: string; 
    position: string; 
    empresa: number;
    department: string; // Added department
  }) {
    this.email = data.email;
    this.firstName = data.firstName;
    this.firstSurName = data.firstSurName;
    this.cellPhone = data.cellPhone;
    this.address = data.address;
    this.residencesType = data.residencesType;
    this.neighborhood = data.neighborhood;
    this.position = data.position;
    this.empresa = data.empresa;
    this.department = data.department; // Added department
  }
}