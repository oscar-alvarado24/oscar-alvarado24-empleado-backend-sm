import { Position, stringToEnum } from "../value-objects/Position";
import { Email } from "../value-objects/Email";
import { EMAIL_DOMAINS } from "../value-objects/constants/email_domains";
import { BadEmailExceptions } from "../exceptions/BadEmailExceptions";
import { Expose } from "class-transformer";

export interface EmployeeProps {
  readonly id?: number;
  readonly email: Email;
  readonly firstName: string;
  readonly secondName?: string;
  readonly firstSurName: string;
  readonly secondSurName?: string;
  readonly address: string;
  readonly landline?: string;
  readonly cellPhone: string;
  readonly residencesType: string;
  readonly descriptionResidence?: string;
  readonly neighborhood: string;
  readonly photo?: string;
  readonly position: Position;
  readonly empresa: number;
}

export class EmployeeEntity {
  private readonly props: EmployeeProps;

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

  @Expose()
  get secondName(): string | undefined {
    return this.props.secondName;
  }

  @Expose()
  get firstSurName(): string {
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

  
  setFirstName(firstName: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      firstName
    });
  }

  setSecondName(secondName: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      secondName
    });
  }

  setFirstSurName(firstSurName: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      firstSurName
    });
  }

  setSecondSurName(secondSurName: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      secondSurName
    });
  }

  setEmail(email: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      email: Email.create(email)
    });
  }
  setAddress(address: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      address
    });
  }

  setLandline(landline: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      landline
    });
  }

  setCellPhone(cellPhone: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      cellPhone
    });
  }

  setResidencesType(residencesType: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      residencesType
    });
  }

  setDescriptionResidence(descriptionResidence: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      descriptionResidence
    });
  }

  setNeighborhood(neighborhood: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      neighborhood
    });
  }


  setPhoto(photo: string): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      photo
    });
  }

  setPosition(position: string): EmployeeEntity {
    const positionNew = stringToEnum(position);
    return new EmployeeEntity({
      ...this.props,
      position: positionNew
    });
  }

  setEmpresa(empresa: number): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      empresa
    });
  }

  // Método para crear una copia actualizada del empleado
  update(props: Partial<EmployeeProps>): EmployeeEntity {
    return new EmployeeEntity({
      ...this.props,
      ...props
    });
  }
}