import { Company } from "context/domain/core/entities/company";
import { CompanyRepository } from "context/ports/company.repository";

export class GetCompaniesAdheredLastMonthUseCase {
    constructor(private companyRepo: CompanyRepository) { }

    async execute(): Promise<Company[]> {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const end = now;
        return this.companyRepo.findCompaniesByAdhesionDateRange(start, end);
    }
}
