import { CompanyRepository } from "@context/ports/company.repository";
import { Company } from "@context/domain/core/entities/company";
import { CuitVO } from "@context/domain/core/value-objects/company/cuit";
import { CompanyNameVO } from "@context/domain/core/value-objects/company/companyName";
import { CompanyTypeVO } from "@context/domain/core/value-objects/company/companyTypes";
import { AccountNumberVO } from "@context/domain/core/value-objects/transfer/accountNumber";
import { loadJsonData } from "@infrastructure/utils/jsonLoader";
import { CompanyDTO } from "@interface/http/controllers/companyDTO";

export class CompanyRepositoryImpl implements CompanyRepository {
    private companies: Company[] = [];

    constructor() {
        this.loadData();
    }

    private loadData() {
        try {
            const jsonData = loadJsonData<CompanyDTO>("companies.json");

            for (const dto of jsonData) {
                const cuitR = CuitVO.create(dto.cuit);
                if (!cuitR.ok) throw new Error(`Invalid CUIT: ${cuitR.error}`);

                const nameR = CompanyNameVO.create(dto.name);
                if (!nameR.ok) throw new Error(`Invalid name: ${nameR.error}`);

                const typeR = CompanyTypeVO.create(dto.type);
                if (!typeR.ok) throw new Error(`Invalid Type: ${dto.type}`);

                const accounts: AccountNumberVO[] = [];
                for (const acc of dto.accounts || []) {
                    const accR = AccountNumberVO.create(acc);
                    if (!accR.ok) throw new Error(`Invalid account: ${acc}`);
                    accounts.push(accR.value);
                }

                const companyR = Company.create(
                    cuitR.value,
                    nameR.value,
                    typeR.value,
                    accounts,
                    dto.id,
                    dto.dateOfAddition ? new Date(dto.dateOfAddition) : undefined
                );

                if (!companyR.ok) throw new Error(`Error creating Company: ${companyR.error}`);

                this.companies.push(companyR.value);
            }
        } catch (err) {
            console.error("Error loading companies from JSON:", err);
            this.companies = [];
        }
    }

    async save(company: Company): Promise<void> {
        this.companies.push(company);
    }

    async findCompaniesByAdhesionDateRange(start: Date, end: Date): Promise<Company[]> {
        return this.companies.filter(c => {
            const date = c.dateOfAddition.getValue();
            return date >= start && date <= end;
        });
    }

    async findByIds(ids: string[]): Promise<Company[]> {
        return this.companies.filter(c => ids.includes(c.id));
    }
}
