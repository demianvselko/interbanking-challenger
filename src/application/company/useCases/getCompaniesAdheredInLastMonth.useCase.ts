import { CompanyRepository } from 'context/ports/company.repository';
import { Company } from 'context/domain/core/entities/company';
import { Result } from 'context/shraed/result';
import { normalizeError } from 'context/shraed/error.utils';
import { Injectable } from 'interface/shared/dependencyInjection/injectable';

@Injectable()
export class FindCompaniesByAdhesionUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(lastMonth: boolean = true): Promise<Result<Company[]>> {
        try {
            const now = new Date();
            const start = lastMonth
                ? new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                : new Date(0);
            const end = now;

            const companies = await this.companyRepo.findCompaniesByAdhesionDateRange(start, end);
            return Result.ok(companies);
        } catch (err: unknown) {
            return Result.fail(normalizeError(err, 'Failed to fetch companies by adhesion date'));
        }
    }
}
