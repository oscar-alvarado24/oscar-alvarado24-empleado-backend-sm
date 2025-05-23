// src/application/dtos/CreateEmployeeDto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'First name should not be empty' })
  @IsString()
  firstName!: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  @IsString()
  lastName!: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email should be in a valid format' })
  email!: string;

  @IsNotEmpty({ message: 'Position should not be empty' })
  @IsString()
  position!: string;

  @IsNotEmpty({ message: 'Department should not be empty' })
  @IsString()
  department!: string;

  @IsOptional()
  @IsString()
  secondName?: string;

  @IsOptional()
  @IsString()
  secondSurName?: string;

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

  @IsNotEmpty({ message: 'Empresa ID should not be empty' })
  @IsNumber({}, { message: 'Empresa ID must be a number' })
  empresa!: number;
}
