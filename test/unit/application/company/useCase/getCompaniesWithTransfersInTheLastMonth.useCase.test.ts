import { FindCompaniesWithTransfersUseCase } from "@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase";
import { Company } from "@prisma/client";
import { MockCompanyRepository } from "../../../../__mocks__/company.respository.mock";
import { MockTransferRepository } from "../../../../__mocks__/transfer.repository.mock";

describe('FindCompaniesWithTransfersUseCase', () => {
  let companyRepo: MockCompanyRepository;
  let transferRepo: MockTransferRepository;
  let useCase: FindCompaniesWithTransfersUseCase;

  beforeEach(() => {
    companyRepo = new MockCompanyRepository();
    transferRepo = new MockTransferRepository();
    useCase = new FindCompaniesWithTransfersUseCase(companyRepo, transferRepo);

    companyRepo.findByIds = jest.fn();
    transferRepo.findByDateRange = jest.fn();
  });

  it('should return companies that have transfers in last month by default', async () => {
    const mockTransfers = [
      { companyId: '1' },
      { companyId: '2' },
      { companyId: '1' },
    ];

    const mockCompanies: Company[] = [
      {
        name: { getValue: () => 'Company 1' },
        accounts: [],
        type: 'PYME',
      } as unknown as Company,
      {
        name: { getValue: () => 'Company 2' },
        accounts: [],
        type: 'GRANDE',
      } as unknown as Company,
    ];

    (transferRepo.findByDateRange as jest.Mock).mockResolvedValue(
      mockTransfers,
    );
    (companyRepo.findByIds as jest.Mock).mockResolvedValue(mockCompanies);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(2);
      expect(result.value.map((c) => c.name.getValue())).toEqual([
        'Company 1',
        'Company 2',
      ]);
    }

    expect(transferRepo.findByDateRange).toHaveBeenCalledTimes(1);
    expect(companyRepo.findByIds).toHaveBeenCalledWith(['1', '2']);
  });

  it('should return empty array if there are no transfers', async () => {
    (transferRepo.findByDateRange as jest.Mock).mockResolvedValue([]);
    (companyRepo.findByIds as jest.Mock).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([]);
    }

    expect(transferRepo.findByDateRange).toHaveBeenCalledTimes(1);
    expect(companyRepo.findByIds).toHaveBeenCalledWith([]);
  });

  it('should fail if transfer repository throws', async () => {
    (transferRepo.findByDateRange as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Failed to fetch');
    }
  });

  it('should fail if company repository throws', async () => {
    const mockTransfers = [{ companyId: '1' }];
    (transferRepo.findByDateRange as jest.Mock).mockResolvedValue(
      mockTransfers,
    );
    (companyRepo.findByIds as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Failed to fetch');
    }
  });
});
