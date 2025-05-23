"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const Position_1 = require("../value-objects/Position");
const Email_1 = require("../value-objects/Email");
const email_domains_1 = require("../value-objects/constants/email_domains");
const BadEmailExceptions_1 = require("../exceptions/BadEmailExceptions");
const class_transformer_1 = require("class-transformer");
class Employee {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    validate() {
        if (!this.esCorreoValido(this.props.email.toString())) {
            throw new BadEmailExceptions_1.BadEmailExceptions("El correo electrónico no es válido.");
        }
    }
    esCorreoValido(email) {
        var _a;
        const dominio = (_a = email.split("@")[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return Object.values(email_domains_1.EMAIL_DOMAINS).includes(dominio);
    }
    ;
    // Getters
    get id() {
        return this.props.id;
    }
    get email() {
        return this.props.email.toString();
    }
    get firstName() {
        return this.props.firstName;
    }
    get fullName() {
        return `${this.props.firstName} ${this.props.firstSurName}`;
    }
    get lastName() {
        return this.props.firstSurName;
    }
    // Getters for the new fields (secondName, secondSurName, landline, descriptionResidence)
    // are already effectively present.
    get secondName() {
        return this.props.secondName;
    }
    get firstSurName() {
        return this.props.firstSurName;
    }
    get secondSurName() {
        return this.props.secondSurName;
    }
    get address() {
        return this.props.address;
    }
    get landline() {
        return this.props.landline;
    }
    get cellPhone() {
        return this.props.cellPhone;
    }
    get residencesType() {
        return this.props.residencesType;
    }
    get descriptionResidence() {
        return this.props.descriptionResidence;
    }
    // Getter for department
    get department() {
        return this.props.department;
    }
    get neighborhood() {
        return this.props.neighborhood;
    }
    get photo() {
        return this.props.photo;
    }
    get position() {
        return this.props.position.toString();
    }
    get empresa() {
        return this.props.empresa;
    }
    // Getters for createdAt and updatedAt
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    setFirstName(firstName) {
        return new Employee(Object.assign(Object.assign({}, this.props), { firstName }));
    }
    setSecondName(secondName) {
        return new Employee(Object.assign(Object.assign({}, this.props), { secondName }));
    }
    setFirstSurName(firstSurName) {
        return new Employee(Object.assign(Object.assign({}, this.props), { firstSurName }));
    }
    setSecondSurName(secondSurName) {
        return new Employee(Object.assign(Object.assign({}, this.props), { secondSurName }));
    }
    setEmail(email) {
        return new Employee(Object.assign(Object.assign({}, this.props), { email: Email_1.Email.create(email) }));
    }
    setAddress(address) {
        return new Employee(Object.assign(Object.assign({}, this.props), { address }));
    }
    setLandline(landline) {
        return new Employee(Object.assign(Object.assign({}, this.props), { landline }));
    }
    setCellPhone(cellPhone) {
        return new Employee(Object.assign(Object.assign({}, this.props), { cellPhone }));
    }
    setResidencesType(residencesType) {
        return new Employee(Object.assign(Object.assign({}, this.props), { residencesType }));
    }
    setDescriptionResidence(descriptionResidence) {
        return new Employee(Object.assign(Object.assign({}, this.props), { descriptionResidence }));
    }
    setNeighborhood(neighborhood) {
        return new Employee(Object.assign(Object.assign({}, this.props), { neighborhood }));
    }
    setPhoto(photo) {
        return new Employee(Object.assign(Object.assign({}, this.props), { photo }));
    }
    setPosition(position) {
        const positionNew = (0, Position_1.stringToEnum)(position);
        return new Employee(Object.assign(Object.assign({}, this.props), { position: positionNew }));
    }
    // Setter for department
    setDepartment(department) {
        return new Employee(Object.assign(Object.assign({}, this.props), { department }));
    }
    // Setters for createdAt and updatedAt (if needed, usually these are set by DB)
    setCreatedAt(createdAt) {
        return new Employee(Object.assign(Object.assign({}, this.props), { createdAt }));
    }
    setUpdatedAt(updatedAt) {
        return new Employee(Object.assign(Object.assign({}, this.props), { updatedAt }));
    }
    setEmpresa(empresa) {
        return new Employee(Object.assign(Object.assign({}, this.props), { empresa }));
    }
    // Método para crear una copia actualizada del empleado
    update(props) {
        return new Employee(Object.assign(Object.assign({}, this.props), props));
    }
}
exports.Employee = Employee;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "id", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "email", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "firstName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "fullName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "lastName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "secondName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "firstSurName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "secondSurName", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "address", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "landline", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "cellPhone", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "residencesType", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "descriptionResidence", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "department", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "neighborhood", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "photo", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "position", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Employee.prototype, "empresa", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "createdAt", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Employee.prototype, "updatedAt", null);
//# sourceMappingURL=Employee.js.map