import { Company } from '../domain/core/entities/company';

export abstract class CompanyRepository {
  abstract save(company: Company): Promise<void>;
  abstract findCompaniesByAdhesionDateRange(
    start: Date,
    end: Date,
  ): Promise<Company[]>;
  abstract findByIds(ids: string[]): Promise<Company[]>;
}
