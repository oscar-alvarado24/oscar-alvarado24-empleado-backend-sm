export class EmployeeResponse {
  id: number;
  firstName: string;
  secondName?: string;
  lastName: string;
  email: string;
  position: string;
  landline?: string;
  descriptionResidence?: string;
  address: string;
  cellPhone: string;
  residencesType: string;
  neighborhood: string;
  company: number;
  workplace: string;
  photo?: string;
  active: boolean;

  constructor(data: {
    id: number;
    firstName: string;
    secondName?: string;
    lastName: string;
    email: string;
    position: string;
    landline?: string;
    descriptionResidence?: string;
    address: string;
    cellPhone: string;
    residencesType: string;
    neighborhood: string;
    company: number;
    workplace: string;
    photo?: string;
    active: boolean;
  }) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.secondName = data.secondName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.position = data.position;
    this.landline = data.landline;
    this.descriptionResidence = data.descriptionResidence;
    this.address = data.address;
    this.cellPhone = data.cellPhone;
    this.residencesType = data.residencesType;
    this.neighborhood = data.neighborhood;
    this.company = data.company;
    this.workplace = data.workplace;
    this.photo = data.photo;
    this.active = data.active;
  }
}