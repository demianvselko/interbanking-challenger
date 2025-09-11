import { prisma } from '@infrastructure/prisma/prisma.client';
import { Transfer } from '@domain/entities/transfer';
import { AccountNumberVO, AmountVO } from '@domain/valueObjects/transfer';
import { Result } from '@domain/shared/result';
import { PrismaTransferRepositoryImpl } from '@infrastructure/repositories/prisma/transfer.repository.impl';

function unwrap<T>(result: Result<T>): T {
    if (!result.ok) {
        if (result.error instanceof Error) {
            throw result.error;
        }
        throw new Error(result.error);
    }
    return result.value;
}

jest.mock('@infrastructure/prisma/prisma.client', () => ({
    prisma: {
        transfer: {
            findMany: jest.fn(),
        },
    },
}));

describe('PrismaTransferRepositoryImpl (unit)', () => {
    let repo: PrismaTransferRepositoryImpl;

    beforeEach(() => {
        repo = new PrismaTransferRepositoryImpl();
        jest.clearAllMocks();
    });

    it('should map database records to domain transfers', async () => {
        (prisma.transfer.findMany as jest.Mock).mockResolvedValue([
            {
                companyId: 'comp-1',
                debitAccount: '112233445566',
                creditAccount: '223344556677',
                amount: 500,
                date: new Date('2024-01-01'),
            },
        ]);

        const transfers = await repo.findByDateRange(
            new Date('2024-01-01'),
            new Date('2024-12-31'),
        );

        expect(prisma.transfer.findMany).toHaveBeenCalledWith({
            where: {
                date: {
                    gte: new Date('2024-01-01'),
                    lte: new Date('2024-12-31'),
                },
            },
        });

        expect(transfers).toHaveLength(1);
        expect(transfers[0]).toBeInstanceOf(Transfer);
        expect(transfers[0].amount).toBe(500);
        expect(transfers[0].debitAccount.getValue()).toBe('112233445566');
    });

    it('should throw if debit account is invalid', async () => {
        (prisma.transfer.findMany as jest.Mock).mockResolvedValue([
            {
                companyId: 'comp-2',
                debitAccount: 'invalid-acc',
                creditAccount: '333-444',
                amount: 100,
                date: new Date(),
            },
        ]);

        await expect(
            repo.findByDateRange(new Date('2024-01-01'), new Date('2024-12-31')),
        ).rejects.toThrow(/Invalid debit account/);
    });

    it('should throw if credit account is invalid', async () => {
        (prisma.transfer.findMany as jest.Mock).mockResolvedValue([
            {
                companyId: 'comp-3',
                debitAccount: '112233445566',
                creditAccount: 'bad',
                amount: 100,
                date: new Date(),
            },
        ]);

        await expect(
            repo.findByDateRange(new Date('2024-01-01'), new Date('2024-12-31')),
        ).rejects.toThrow(/Invalid credit account/);
    });

    it('should throw if amount is invalid', async () => {
        (prisma.transfer.findMany as jest.Mock).mockResolvedValue([
            {
                companyId: 'comp-4',
                debitAccount: '112233445566',
                creditAccount: '223344556677',
                amount: -50,
                date: new Date(),
            },
        ]);

        await expect(
            repo.findByDateRange(new Date('2024-01-01'), new Date('2024-12-31')),
        ).rejects.toThrow(/Invalid amount/);
    });

    it('should throw if Transfer.create fails', async () => {
        const invalidDate = null as unknown as Date;

        (prisma.transfer.findMany as jest.Mock).mockResolvedValue([
            {
                companyId: 'comp-5',
                debitAccount: '111-222',
                creditAccount: '333-444',
                amount: 500,
                date: invalidDate,
            },
        ]);

        await expect(
            repo.findByDateRange(new Date('2024-01-01'), new Date('2024-12-31')),
        ).rejects.toThrow("Invalid debit account: 111-222");
    });
});
