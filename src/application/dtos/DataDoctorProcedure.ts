export class DataDoctorProcedure {
    id: string
    name: string
    company: string;
    workplace: string;
    specialty: string;

    constructor(
        id: string,
        name: string,
        company: string,
        workplace: string,
        specialty: string
    ) {
        this.id =  id;;
        this.name = name;
        this.company = company;
        this.workplace = workplace;
        this.specialty = specialty
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            company: this.company,
            workplace: this.workplace,
            specialty: this.specialty
        }
    }
}