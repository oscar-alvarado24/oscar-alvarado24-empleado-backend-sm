export class DataDoctorProcedure {
    id: number
    name: string
    company: number;
    workplace: string;
    specialty: string;

    constructor(
        id: number | string,
        name: string,
        company: number,
        workplace: string,
        specialty: string
    ) {
        this.id = typeof id === 'string' ? Number(id) : id;;
        this.name = name;
        this.company = company;
        this.workplace = workplace;
        this.specialty = specialty
    }
    toJSON() {
        return {
            id: Number(this.id),
            name: this.name,
            company: this.company,
            workplace: this.workplace,
            specialty: this.specialty
        }
    }
}