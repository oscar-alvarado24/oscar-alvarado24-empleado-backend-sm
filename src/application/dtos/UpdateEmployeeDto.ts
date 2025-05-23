// src/application/dtos/UpdateEmployeeDto.ts
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator'; // Added IsNumber

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string if provided' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string if provided' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email should be in a valid format if provided' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Position must be a string if provided' })
  position?: string;

  @IsOptional()
  @IsString({ message: 'Department must be a string if provided' })
  department?: string;

  @IsOptional()
  @IsString({ message: 'Second name must be a string if provided' })
  secondName?: string;

  @IsOptional()
  @IsString({ message: 'Second surname must be a string if provided' })
  secondSurName?: string;

  @IsOptional()
  @IsString({ message: 'Landline must be a string if provided' })
  landline?: string;

  @IsOptional()
  @IsString({ message: 'Description of residence must be a string if provided' })
  descriptionResidence?: string;

  // Add missing optional fields from EmployeeProps
  @IsOptional()
  @IsString({ message: 'Address must be a string if provided' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Cell phone must be a string if provided' })
  cellPhone?: string;

  @IsOptional()
  @IsString({ message: 'Residences type must be a string if provided' })
  residencesType?: string;

  @IsOptional()
  @IsString({ message: 'Neighborhood must be a string if provided' })
  neighborhood?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Empresa ID must be a number if provided' })
  empresa?: number;
}
