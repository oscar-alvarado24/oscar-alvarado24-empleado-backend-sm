import { Position, stringToEnum } from "../value-objects/Position";
import { Email } from "../value-objects/Email";
import { EMAIL_DOMAINS } from "../value-objects/constants/email_domains";
import { BadEmailExceptions } from "../exceptions/BadEmailExceptions";
import { Expose } from "class-transformer";

export interface EmployeeProps {
  id?: number;
  email: Email;
  firstName: string;
  secondName?: string; // Already exists
  firstSurName: string;
  secondSurName?: string; // Already exists
  address: string;
  landline?: string; // Already exists
  cellPhone: string;
  residencesType: string;
  descriptionResidence?: string; // Already exists
  neighborhood: string;
  photo?: string;
  position: Position;
  empresa: number;
  // Ensure all required fields from the prompt are here
  // department is missing in EmployeeProps, but was in the prompt's simpler Employee class.
  // For now, I will stick to what's in EmployeeProps and the prompt's new fields.
  // The prompt's new fields: secondName, secondSurName, landline, descriptionResidence
  // all seem to be already present or match existing fields.
  // Let's double check the prompt's example:
  // secondName?: string;
  // secondSurName?: string;
  // landline?: string;
  // descriptionResidence?: string;
  // These are already in EmployeeProps.
  // The original prompt also had:
  // id: string | null, (EmployeeProps has id?: number)
  // firstName: string, (EmployeeProps has firstName: string)
  // lastName: string, (EmployeeProps has firstSurName: string and secondSurName?: string) - this is a mismatch to address
  // email: string, (EmployeeProps has email: Email)
  // position: string, (EmployeeProps has position: Position)
  // department: string, (EmployeeProps is missing department)
  // createdAt?: Date, (EmployeeProps is missing createdAt)
  // updatedAt?: Date (EmployeeProps is missing updatedAt)

  // It seems the existing EmployeeProps is more detailed.
  // I will add department, createdAt, and updatedAt to EmployeeProps for consistency with the prompt's target state.
  // And adjust lastName. The prompt used 'lastName', this file uses 'firstSurName' and 'secondSurName'.
  // I will assume 'firstSurName' is the primary 'lastName'.

  department: string; // Added from prompt
  createdAt?: Date; // Added from prompt
  updatedAt?: Date; // Added from prompt
}

export class Employee { // Renamed from EmployeeEntity
  private props: EmployeeProps; // Removed readonly

  constructor(props: EmployeeProps) {
    this.props = props;
    this.validate();
  }

  private validate(): void {
    if (!this.esCorreoValido(this.props.email.toString())) {
      throw new BadEmailExceptions("El correo electrónico no es válido.");
    }
  }
  esCorreoValido (email: string): boolean {
    const dominio = email.split("@")[1]?.toLowerCase();
    return Object.values(EMAIL_DOMAINS).includes(dominio as any);
  };

  // Getters
  @Expose()
  get id(): number | undefined {
    return this.props.id;
  }

  @Expose()
  get email(): string {
    return this.props.email.toString();
  }

  @Expose()
  get firstName(): string {
    return this.props.firstName;
  }

  @Expose()
  get fullName(): string {
    return `${this.props.firstName} ${this.props.firstSurName}`;
  }

  @Expose()
  get lastName(): string {
    return this.props.firstSurName;
  }

  // Getters for the new fields (secondName, secondSurName, landline, descriptionResidence)
  // are already effectively present.

  @Expose()
  get secondName(): string | undefined {
    return this.props.secondName;
  }

  @Expose()
  get firstSurName(): string { // This is effectively 'lastName' from the prompt's perspective
    return this.props.firstSurName;
  }

  @Expose()
  get secondSurName(): string | undefined {
    return this.props.secondSurName;
  }

  @Expose()
  get address(): string {
    return this.props.address;
  }

  @Expose()
  get landline(): string | undefined {
    return this.props.landline;
  }

  @Expose()
  get cellPhone(): string {
    return this.props.cellPhone;
  }

  @Expose()
  get residencesType(): string {
    return this.props.residencesType;
  }

  @Expose()
  get descriptionResidence(): string | undefined {
    return this.props.descriptionResidence;
  }

  // Getter for department
  @Expose()
  get department(): string {
    return this.props.department;
  }

  @Expose()
  get neighborhood(): string {
    return this.props.neighborhood;
  }

  @Expose()
  get photo(): string | undefined {
    return this.props.photo;
  }

  @Expose() 
  get position(): string {
    return this.props.position.toString();
  }

  @Expose()
  get empresa(): number {
    return this.props.empresa;
  }

  // Getters for createdAt and updatedAt
  @Expose()
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  @Expose()
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  
  setFirstName(firstName: string): Employee {
    return new Employee({
      ...this.props,
      firstName
    });
  }

  setSecondName(secondName: string): Employee {
    return new Employee({
      ...this.props,
      secondName
    });
  }

  setFirstSurName(firstSurName: string): Employee {
    return new Employee({
      ...this.props,
      firstSurName
    });
  }

  setSecondSurName(secondSurName: string): Employee {
    return new Employee({
      ...this.props,
      secondSurName
    });
  }

  setEmail(email: string): Employee {
    return new Employee({
      ...this.props,
      email: Email.create(email)
    });
  }
  setAddress(address: string): Employee {
    return new Employee({
      ...this.props,
      address
    });
  }

  setLandline(landline: string): Employee {
    return new Employee({
      ...this.props,
      landline
    });
  }

  setCellPhone(cellPhone: string): Employee {
    return new Employee({
      ...this.props,
      cellPhone
    });
  }

  setResidencesType(residencesType: string): Employee {
    return new Employee({
      ...this.props,
      residencesType
    });
  }

  setDescriptionResidence(descriptionResidence: string): Employee {
    return new Employee({
      ...this.props,
      descriptionResidence
    });
  }

  setNeighborhood(neighborhood: string): Employee {
    return new Employee({
      ...this.props,
      neighborhood
    });
  }


  setPhoto(photo: string): Employee {
    return new Employee({
      ...this.props,
      photo
    });
  }

  setPosition(position: string): Employee {
    const positionNew = stringToEnum(position);
    return new Employee({
      ...this.props,
      position: positionNew
    });
  }

  // Setter for department
  setDepartment(department: string): Employee {
    return new Employee({
      ...this.props,
      department
    });
  }

  // Setters for createdAt and updatedAt (if needed, usually these are set by DB)
  setCreatedAt(createdAt: Date): Employee {
    return new Employee({
      ...this.props,
      createdAt
    });
  }

  setUpdatedAt(updatedAt: Date): Employee {
    return new Employee({
      ...this.props,
      updatedAt
    });
  }

  setEmpresa(empresa: number): Employee {
    return new Employee({
      ...this.props,
      empresa
    });
  }

  // Método para crear una copia actualizada del empleado
  update(props: Partial<EmployeeProps>): Employee {
    return new Employee({
      ...this.props,
      ...props
    });
  }
}