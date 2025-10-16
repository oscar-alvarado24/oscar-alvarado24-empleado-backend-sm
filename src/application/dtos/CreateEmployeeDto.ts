// src/application/dtos/CreateEmployeeDto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'ID should not be empty' })
  @IsNumber({}, { message: 'ID must be a number' })
  id!: number;

  @IsNotEmpty({ message: 'First name should not be empty' })
  @IsString()
  firstName!: string;
  
  @IsOptional()
  @IsString()
  secondName?: string;
  
  @IsNotEmpty({ message: 'Last name should not be empty' })
  @IsString()
  lastName!: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email should be in a valid format' })
  email!: string;

  @IsNotEmpty({ message: 'Position should not be empty' })
  @IsString()
  position!: string;

  @IsOptional()
  @IsString()
  landline?: string;

  @IsOptional()
  @IsString()
  descriptionResidence?: string;

  @IsNotEmpty({ message: 'Address should not be empty' })
  @IsString()
  address!: string;

  @IsNotEmpty({ message: 'Cell phone should not be empty' })
  @IsString()
  cellPhone!: string;

  @IsNotEmpty({ message: 'Residences type should not be empty' })
  @IsString()
  residencesType!: string;

  @IsNotEmpty({ message: 'Neighborhood should not be empty' })
  @IsString()
  neighborhood!: string;

  @IsNotEmpty({ message: 'Company ID should not be empty' })
  @IsNumber({}, { message: 'Company ID must be a number' })
  company!: number;

  @IsNotEmpty({ message: 'Workplace ID should not be empty' })
  @IsString({ message: 'Workplace ID must be a string' })
  workplace!: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}
