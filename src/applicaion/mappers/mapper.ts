import { plainToClass, instanceToPlain } from 'class-transformer';
import { EmployeeRequest } from '../dto/EmployeeRequest';
import { EmployeeEntity, EmployeeProps } from '../../domain/entities/Employee';
import { Email } from "../../domain/value-objects/Email";
import { stringToEnum } from "../../domain/value-objects/Position";
import { logger } from '../../config/logger';
import { MapperError } from '../handler/exceptions/MapperError';

export class EmployeeMapper {
  
    static toEntity(employeeRequest: EmployeeRequest): EmployeeEntity {

      try{
      const transformedData = plainToClass(EmployeeRequest, employeeRequest);
      
      const props: EmployeeProps = {
        email: Email.create(transformedData.email), 
        firstName: transformedData.firstName,
        secondName: transformedData.secondName,
        firstSurName: transformedData.firstSurName,
        secondSurName: transformedData.secondSurName,
        address: transformedData.address,
        landline: transformedData.landline,
        cellPhone: transformedData.cellPhone,
        residencesType: transformedData.residencesType,
        descriptionResidence: transformedData.descriptionResidence,
        neighborhood: transformedData.neighborhood,
        position: stringToEnum(transformedData.position), 
        empresa: transformedData.empresa,
      };
  
      return new EmployeeEntity(props);
    }catch(error) {
      logger.error(error);
      throw new MapperError(`Error al convertir DTO a Entity`);
    }
  }
  
    static toDTO(employeeEntity: EmployeeEntity): EmployeeRequest {
      try{
      const plainObject = instanceToPlain(employeeEntity);
      
      return plainToClass(EmployeeRequest, plainObject);
      } catch(error) {
        logger.error(error);
        throw new MapperError(`Error al convertir Entity a DTO`);
      }
    }
  }