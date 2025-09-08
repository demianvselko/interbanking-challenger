import { Company } from "context/domain/core/entities/company";
import { CompanyNameVO } from "context/domain/core/value-objects/company/companyName";
import { CuitVO } from "context/domain/core/value-objects/company/cuit";
import { CompanyRepository } from "context/ports/company.repository";


export type CompanyType = 'PYME' | 'CORPORATIVA';

export interface CreateCompanyRequest {
    cuit: string;
    name: string;
    type: CompanyType;
}

export class CreateCompanyUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(request: CreateCompanyRequest): Promise<Company> {
        try {
            const cuitVO = new CuitVO(request.cuit);
            const nameVO = new CompanyNameVO(request.name);

            const company = Company.create(
                cuitVO,
                nameVO,
                request.type
            );

            await this.companyRepo.save(company);
            return company;
        } catch (error: any) {
            throw new Error(`Failed to register company adhesion: ${error.message}`);
        }
    }
}
