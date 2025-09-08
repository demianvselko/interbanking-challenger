export interface CompanyDTO {
    id?: string;
    cuit: string;
    name: string;
    type: 'PYME' | 'CORPORATIVA';
    accounts?: string[];
    dateOfAddition: string;
}
