import { Company } from "context/domain/core/entities/company";
import { CompanyNameVO } from "context/domain/core/value-objects/company/companyName";
import { CuitVO } from "context/domain/core/value-objects/company/cuit";
import { CompanyRepository } from "context/ports/company.repository";
import { CreateCompanyRequest } from "../dto/createCompany.dto";
import { AccountNumberVO } from "context/domain/core/value-objects/transfer/accountNumber";
import { CompanyTypeVO } from "context/domain/core/value-objects/company/companyTypes";

export class CreateCompanyUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(request: CreateCompanyRequest): Promise<Company> {
        try {
            const cuitVO = new CuitVO(request.cuit);
            const nameVO = new CompanyNameVO(request.name);
            const typeVO = new CompanyTypeVO(request.type);
            const accountsVO = (request.accounts || []).map(account => new AccountNumberVO(account));

            const company = Company.create(
                cuitVO,
                nameVO,
                typeVO,
                accountsVO
            );

            await this.companyRepo.save(company);
            return company;
        } catch (error: any) {
            throw new Error(`Failed to register company adhesion: ${error.message}`);
        }
    }
}
