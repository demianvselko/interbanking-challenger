import { CompanyRepository } from "context/ports/company.repository";
import { TransferRepository } from "context/ports/transfer.repository";
import { Company } from "context/domain/core/entities/company";

export class GetCompaniesWithTransfersLastMonthUseCase {
    constructor(
        private transferRepo: TransferRepository,
        private companyRepo: CompanyRepository
    ) { }

    async execute(): Promise<Company[]> {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const end = today;

        const transfers = await this.transferRepo.findByDateRange(start, end);
        const companyIds = Array.from(new Set(transfers.map(t => t.companyId)));

        const companies: Company[] = [];
        for (const id of companyIds) {
            const company = await this.companyRepo.findByCuit(id);
            if (company) companies.push(company);
        }

        return companies;
    }
}
