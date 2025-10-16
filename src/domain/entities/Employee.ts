import { Position, stringToEnum } from "../value-objects/Position";
import { Email } from "../value-objects/Email";
import { EMAIL_DOMAINS } from "../value-objects/constants/email_domains";
import { BadEmailExceptions } from "../exceptions/BadEmailExceptions";
import { Expose } from "class-transformer";

export interface EmployeeProps {
  id: number;
  email: Email;
  firstName: string;
  secondName?: string;
  lastName: string;
  address: string;
  landline?: string;
  cellPhone: string;
  residencesType: string;
  descriptionResidence?: string;
  neighborhood: string;
  photo?: string;
  position: Position;
  specialty?: string;
  company: number;
  workplace: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Employee {
  private readonly employee: EmployeeProps;

  constructor(employee: EmployeeProps) {
    this.employee = employee;
    this.validate();
  }

  private validate(): void {
    if (!this.esCorreoValido(this.employee.email.toString())) {
      throw new BadEmailExceptions("El correo electrónico no es válido.");
    }
  }
  esCorreoValido(email: string): boolean {
    const dominio = email.split("@")[1]?.toLowerCase();
    return Object.values(EMAIL_DOMAINS).includes(dominio as any);
  };

  // Getters
  @Expose()
  get id(): number {
    return this.employee.id;
  }

  @Expose()
  get email(): string {
    return this.employee.email.toString();
  }

  @Expose()
  get firstName(): string {
    return this.employee.firstName;
  }

  @Expose()
  get lastName(): string {
    return this.employee.lastName;
  }

  @Expose()
  get secondName(): string | undefined {
    return this.employee.secondName;
  }

  @Expose()
  get address(): string {
    return this.employee.address;
  }

  @Expose()
  get landline(): string | undefined {
    return this.employee.landline;
  }

  @Expose()
  get cellPhone(): string {
    return this.employee.cellPhone;
  }

  @Expose()
  get residencesType(): string {
    return this.employee.residencesType;
  }

  @Expose()
  get descriptionResidence(): string | undefined {
    return this.employee.descriptionResidence;
  }

  @Expose()
  get neighborhood(): string {
    return this.employee.neighborhood;
  }

  @Expose()
  get photo(): string | undefined {
    return this.employee.photo;
  }

  @Expose()
  get position(): string {
    return this.employee.position.toString();
  }

  @Expose()
  get specialty(): string | undefined {
    return this.employee.specialty;
  }

  @Expose()
  get company(): number {
    return this.employee.company;
  }

  @Expose()
  get workplace(): string {
    return this.employee.workplace;
  }

  @Expose()
  get active(): boolean {
    return this.employee.active ?? false;
  }


  @Expose()
  get createdAt(): Date | undefined {
    return this.employee.createdAt;
  }

  @Expose()
  get updatedAt(): Date | undefined {
    return this.employee.updatedAt;
  }

  setFirstName(firstName: string): Employee {
    return new Employee({
      ...this.employee,
      firstName
    });
  }

  setSecondName(secondName: string): Employee {
    return new Employee({
      ...this.employee,
      secondName
    });
  }

  setLastName(lastName: string): Employee {
    return new Employee({
      ...this.employee,
      lastName
    });
  }
  setEmail(email: string): Employee {
    return new Employee({
      ...this.employee,
      email: Email.create(email)
    });
  }
  setAddress(address: string): Employee {
    return new Employee({
      ...this.employee,
      address
    });
  }

  setLandline(landline: string): Employee {
    return new Employee({
      ...this.employee,
      landline
    });
  }

  setCellPhone(cellPhone: string): Employee {
    return new Employee({
      ...this.employee,
      cellPhone
    });
  }

  setResidencesType(residencesType: string): Employee {
    return new Employee({
      ...this.employee,
      residencesType
    });
  }

  setDescriptionResidence(descriptionResidence: string): Employee {
    return new Employee({
      ...this.employee,
      descriptionResidence
    });
  }

  setNeighborhood(neighborhood: string): Employee {
    return new Employee({
      ...this.employee,
      neighborhood
    });
  }


  setPhoto(photo: string): Employee {
    return new Employee({
      ...this.employee,
      photo
    });
  }

  setPosition(position: string): Employee {
    const positionNew = stringToEnum(position);
    return new Employee({
      ...this.employee,
      position: positionNew
    });
  }

  setActive(active: boolean): Employee {
    return new Employee({
      ...this.employee,
      active
    });
  }

  setUpdatedAt(updatedAt: Date): Employee {
    return new Employee({
      ...this.employee,
      updatedAt
    });
  }

  setEmpresa(company: number): Employee {
    return new Employee({
      ...this.employee,
      company
    });
  }

  setWorkplace(workplace: string): Employee {
    return new Employee({
      ...this.employee,
      workplace
    });
  }

  update(employee: Partial<EmployeeProps>): Employee {
    return new Employee({
      ...this.employee,
      ...employee
    });
  }
}