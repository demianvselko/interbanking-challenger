import { CompanyRepository } from "context/ports/company.repository";
import { Company } from "context/domain/core/entities/company";
import { CreateCompanyRequest } from "../dto/createCompany.dto";
import { CuitVO } from "context/domain/core/value-objects/company/cuit";
import { CompanyNameVO } from "context/domain/core/value-objects/company/companyName";
import { CompanyTypeVO } from "context/domain/core/value-objects/company/companyTypes";
import { AccountNumberVO } from "context/domain/core/value-objects/transfer/accountNumber";
import { normalizeError } from "context/shraed/error.utils";
import { Result } from "context/shraed/result";

export class CreateCompanyUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(request: CreateCompanyRequest): Promise<Result<Company>> {
        try {
            const cuitVO = new CuitVO(request.cuit);
            const nameVO = new CompanyNameVO(request.name);
            const typeVO = new CompanyTypeVO(request.type);
            const accountsVO = (request.accounts || []).map(acc => new AccountNumberVO(acc));

            const companyOrError = Company.create(cuitVO, nameVO, typeVO, accountsVO);
            if (!companyOrError.ok) {
                return Result.fail(companyOrError.error);
            }

            const company = companyOrError.value;

            await this.companyRepo.save(company);
            return Result.ok(company);
        } catch (err: unknown) {
            return Result.fail(normalizeError(err, 'Failed to create'));
        }
    }
}
