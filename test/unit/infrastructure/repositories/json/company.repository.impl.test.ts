jest.mock('@infrastructure/utils/jsonLoader', () => ({
  loadJsonData: jest.fn(),
}));

import { Company } from '@domain/entities/company';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { loadJsonData } from '@infrastructure/utils/jsonLoader';

const mockedLoadJsonData = loadJsonData as jest.MockedFunction<
  typeof loadJsonData
>;

describe('CompanyRepositoryImpl', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should load companies correctly from JSON', () => {
    const jsonData = [
      {
        id: '1',
        cuit: '12345678901',
        name: 'Test Company',
        type: 'PYME',
        accounts: ['12345678910'],
      },
    ];

    mockedLoadJsonData.mockReturnValue(jsonData);

    const repo = new CompanyRepositoryImpl();

    expect(repo['companies']).toHaveLength(1);
    const company = repo['companies'][0];
    expect(company.name.getValue()).toBe('Test Company');
    expect(company.accounts.map((acc) => acc.getValue())).toEqual([
      '12345678910',
    ]);
  });

  it('should handle errors in JSON loading and set companies to empty array', () => {
    mockedLoadJsonData.mockImplementation(() => {
      throw new Error('File not found');
    });

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => { });

    const repo = new CompanyRepositoryImpl();

    expect(repo['companies']).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading companies from JSON:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should save a new company', async () => {
    mockedLoadJsonData.mockReturnValue([]);
    const repo = new CompanyRepositoryImpl();

    const company = {
      id: '2',
      name: { getValue: () => 'New Company' },
      accounts: [],
      type: 'PYME',
      dateOfAddition: { getValue: () => new Date() },
    } as unknown as Company;

    await repo.save(company);

    expect(repo['companies']).toContain(company);
  });

  it('should find companies by adhesion date range', async () => {
    mockedLoadJsonData.mockReturnValue([]);
    const repo = new CompanyRepositoryImpl();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const company1 = {
      id: '1',
      name: { getValue: () => 'C1' },
      accounts: [],
      type: 'PYME',
      dateOfAddition: { getValue: () => today },
    } as unknown as Company;

    const company2 = {
      id: '2',
      name: { getValue: () => 'C2' },
      accounts: [],
      type: 'PYME',
      dateOfAddition: { getValue: () => yesterday },
    } as unknown as Company;

    await repo.save(company1);
    await repo.save(company2);

    const result = await repo.findCompaniesByAdhesionDateRange(
      yesterday,
      today,
    );
    expect(result).toContain(company1);
    expect(result).toContain(company2);
  });

  it('should find companies by ids', async () => {
    mockedLoadJsonData.mockReturnValue([]);
    const repo = new CompanyRepositoryImpl();

    const company1 = { id: '1' } as unknown as Company;
    const company2 = { id: '2' } as unknown as Company;

    await repo.save(company1);
    await repo.save(company2);

    const result = await repo.findByIds(['2']);
    expect(result).toEqual([company2]);
  });
});
