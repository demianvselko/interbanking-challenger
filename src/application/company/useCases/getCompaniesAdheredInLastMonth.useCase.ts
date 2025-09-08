import { CompanyRepository } from "context/ports/company.repository";
import { Company } from "context/domain/core/entities/company";
import { normalizeError } from "context/shraed/error.utils";
import { Result } from "context/shraed/result";


export class FindCompaniesByAdhesionUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(start: Date, end: Date): Promise<Result<Company[]>> {
        try {
            const companies = await this.companyRepo.findCompaniesByAdhesionDateRange(start, end);
            return Result.ok(companies);
        } catch (err: unknown) {
            return Result.fail(normalizeError(err, 'Failed to fetch companies by adhesion date'));
        }
    }
}
