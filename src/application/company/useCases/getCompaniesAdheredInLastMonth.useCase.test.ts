import { Company } from '@context/domain/core/entities/company';
import { MockCompanyRepository } from '../../../../__mocks__/company.respository.mock';
import { FindCompaniesByAdhesionUseCase } from './getCompaniesAdheredInLastMonth.useCase';

describe('FindCompaniesByAdhesionUseCase', () => {
  let repo: MockCompanyRepository;
  let useCase: FindCompaniesByAdhesionUseCase;

  beforeEach(() => {
    repo = new MockCompanyRepository();
    useCase = new FindCompaniesByAdhesionUseCase(repo);

    repo.findCompaniesByAdhesionDateRange = jest.fn();
  });

  it('should return companies for last month by default', async () => {
    const mockCompanies: Company[] = [
      {
        name: { getValue: () => 'Company A' },
        accounts: [],
        type: 'PYME',
      } as unknown as Company,
      {
        name: { getValue: () => 'Company B' },
        accounts: [],
        type: 'GRANDE',
      } as unknown as Company,
    ];

    (repo.findCompaniesByAdhesionDateRange as jest.Mock).mockResolvedValue(
      mockCompanies,
    );

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].name.getValue()).toBe('Company A');
    }

    expect(repo.findCompaniesByAdhesionDateRange).toHaveBeenCalledTimes(1);
    const startDate = (repo.findCompaniesByAdhesionDateRange as jest.Mock).mock
      .calls[0][0];
    const endDate = (repo.findCompaniesByAdhesionDateRange as jest.Mock).mock
      .calls[0][1];
    expect(startDate).toBeInstanceOf(Date);
    expect(endDate).toBeInstanceOf(Date);
  });

  it('should return all companies if lastMonth=false', async () => {
    const mockCompanies: Company[] = [
      {
        name: { getValue: () => 'Company X' },
        accounts: [],
        type: 'PYME',
      } as unknown as Company,
    ];

    (repo.findCompaniesByAdhesionDateRange as jest.Mock).mockResolvedValue(
      mockCompanies,
    );

    const result = await useCase.execute(false);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value[0].name.getValue()).toBe('Company X');
    }
  });

  it('should fail if repository throws an error', async () => {
    (repo.findCompaniesByAdhesionDateRange as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch companies by adhesion date'),
    );

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Failed to fetch companies by adhesion date');
    }
  });
});
