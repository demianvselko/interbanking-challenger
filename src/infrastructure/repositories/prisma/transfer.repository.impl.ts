import { Transfer } from '@domain/entities/transfer';
import { TransferRepository } from '@domain/ports/transfer.repository';
import { AccountNumberVO, AmountVO } from '@domain/valueObjects/transfer';
import { prisma } from '@infrastructure/prisma/prisma.client';

export class PrismaTransferRepositoryImpl implements TransferRepository {
  async findByDateRange(start: Date, end: Date): Promise<Transfer[]> {
    const records = await prisma.transfer.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    return records.map((record) => {
      const debitR = AccountNumberVO.create(record.debitAccount);
      if (!debitR.ok) throw new Error(`Invalid debit account: ${record.debitAccount}`);

      const creditR = AccountNumberVO.create(record.creditAccount);
      if (!creditR.ok) throw new Error(`Invalid credit account: ${record.creditAccount}`);

      const amountR = AmountVO.create(record.amount);
      if (!amountR.ok) throw new Error(`Invalid amount: ${record.amount}`);

      const transferR = Transfer.create(
        record.companyId,
        debitR.value,
        creditR.value,
        amountR.value,
        record.date,
      );

      if (!transferR.ok) throw new Error(`Error creating Transfer: ${transferR.error}`);
      return transferR.value;
    });
  }
}
