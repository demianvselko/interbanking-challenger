import { Company } from "@context/domain/core/entities/company";
import { CompanyRepository } from "@context/ports/company.repository";

export class MockCompanyRepository extends CompanyRepository {
    save = jest.fn<Promise<void>, [Company]>();
    findCompaniesByAdhesionDateRange = jest.fn<Promise<Company[]>, [Date, Date]>();
    findByIds = jest.fn<Promise<Company[]>, [string[]]>();
}
