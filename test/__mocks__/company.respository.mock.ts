import { Company } from "@domain/entities/company";
import { CompanyRepository } from "@domain/ports/company.repository";


export class MockCompanyRepository extends CompanyRepository {
    save = jest.fn<Promise<void>, [Company]>();
    findCompaniesByAdhesionDateRange = jest.fn<Promise<Company[]>, [Date, Date]>();
    findByIds = jest.fn<Promise<Company[]>, [string[]]>();
}
