import { Company } from '../domain/core/entities/company';
import { MockCompanyRepository } from '../../../__mocks__/company.respository.mock';

describe('CompanyRepository (abstract)', () => {
  let repo: MockCompanyRepository;
  let company: Company;

  beforeEach(() => {
    repo = new MockCompanyRepository();

    company = {
      cuit: { getValue: () => '12345678901' },
      name: { getValue: () => 'Test Company' },
      type: 'PYME',
      accounts: [],
    } as unknown as Company;
  });

  it('should call save with a company', async () => {
    await repo.save(company);
    expect(repo.save).toHaveBeenCalledWith(company);
  });

  it('should call findCompaniesByAdhesionDateRange with start and end dates', async () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-02-01');

    await repo.findCompaniesByAdhesionDateRange(start, end);
    expect(repo.findCompaniesByAdhesionDateRange).toHaveBeenCalledWith(
      start,
      end,
    );
  });

  it('should call findByIds with an array of ids', async () => {
    const ids = ['id1', 'id2'];
    await repo.findByIds(ids);
    expect(repo.findByIds).toHaveBeenCalledWith(ids);
  });
});
