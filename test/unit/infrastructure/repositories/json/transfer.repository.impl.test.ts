jest.mock('@infrastructure/utils/jsonLoader', () => ({
  loadJsonData: jest.fn(),
}));

import { Transfer } from '@domain/entities/transfer';
import { TransferRepositoryImpl } from '@infrastructure/repositories/json/transfer.repository.impl';
import { loadJsonData } from '@infrastructure/utils/jsonLoader';


const mockedLoadJsonData = loadJsonData as jest.MockedFunction<
  typeof loadJsonData
>;

describe('TransferRepositoryImpl', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should load transfers correctly from JSON', () => {
    const jsonData = [
      {
        companyId: 'C1',
        debitAccount: '12345678910',
        creditAccount: '01987654321',
        amount: 100,
        date: new Date().toISOString(),
      },
    ];

    mockedLoadJsonData.mockReturnValue(jsonData);

    const repo = new TransferRepositoryImpl();

    expect(repo['transfers']).toHaveLength(1);

    const transfer = repo['transfers'][0];
    expect(transfer.companyId).toBe('C1');
    expect(transfer.amount).toBe(100);
    expect(transfer.debitAccount.getValue()).toBe('12345678910');
    expect(transfer.creditAccount.getValue()).toBe('01987654321');
  });

  it('should handle errors in JSON loading and set transfers to empty array', () => {
    mockedLoadJsonData.mockImplementation(() => {
      throw new Error('File not found');
    });

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => { });

    const repo = new TransferRepositoryImpl();

    expect(repo['transfers']).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading transfers from JSON:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should find transfers by date range', async () => {
    mockedLoadJsonData.mockReturnValue([]);
    const repo = new TransferRepositoryImpl();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const transfer1 = {
      companyId: 'C1',
      debitAccount: { getValue: () => 'ACC1' },
      creditAccount: { getValue: () => 'ACC2' },
      amount: 100,
      date: today,
    } as unknown as Transfer;

    const transfer2 = {
      companyId: 'C2',
      debitAccount: { getValue: () => 'ACC3' },
      creditAccount: { getValue: () => 'ACC4' },
      amount: 200,
      date: yesterday,
    } as unknown as Transfer;

    repo['transfers'].push(transfer1, transfer2);

    const result = await repo.findByDateRange(yesterday, today);
    expect(result).toContain(transfer1);
    expect(result).toContain(transfer2);
  });
});
