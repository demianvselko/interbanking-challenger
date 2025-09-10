
import { Transfer } from '@domain/entities/transfer';
import { TransferRepository } from '@domain/ports/transfer.repository';
import { AccountNumberVO } from '@domain/valueObjects/transfer/accountNumber';
import { AmountVO } from '@domain/valueObjects/transfer/amount';
import { loadJsonData } from '@infrastructure/utils/jsonLoader';

export class TransferRepositoryImpl implements TransferRepository {
  private transfers: Transfer[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const jsonData = loadJsonData<{
        companyId: string;
        debitAccount: string;
        creditAccount: string;
        amount: number;
        date: string;
      }>('transfers.json');

      for (const t of jsonData) {
        const debitR = AccountNumberVO.create(t.debitAccount);
        if (!debitR.ok)
          throw new Error(`Invalid debit account: ${t.debitAccount}`);

        const creditR = AccountNumberVO.create(t.creditAccount);
        if (!creditR.ok)
          throw new Error(`Invalid credit account: ${t.creditAccount}`);

        const amountR = AmountVO.create(t.amount);
        if (!amountR.ok) throw new Error(`Invalid amount: ${t.amount}`);

        const transferR = Transfer.create(
          t.companyId,
          debitR.value,
          creditR.value,
          amountR.value,
          new Date(t.date),
        );

        if (!transferR.ok)
          throw new Error(`Error creating Transfer: ${transferR.error}`);

        this.transfers.push(transferR.value);
      }
    } catch (err) {
      console.error('Error loading transfers from JSON:', err);
      this.transfers = [];
    }
  }

  async findByDateRange(start: Date, end: Date): Promise<Transfer[]> {
    return this.transfers.filter((t) => {
      const date = t.date;
      return date >= start && date <= end;
    });
  }
}
