import { prisma } from '@infrastructure/prisma/prisma.client';
import { Company } from '@domain/entities/company';
import { CuitVO, CompanyNameVO, CompanyTypeVO, AdhesionDateVO } from '@domain/valueObjects/company';
import { AccountNumberVO } from '@domain/valueObjects/transfer';
import { Result } from '@domain/shared/result';
import { CompanyPrismaRepositoryImpl } from '@infrastructure/repositories/prisma/company.repository.impl';

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
        company: {
            upsert: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('CompanyPrismaRepositoryImpl (unit)', () => {
    let repo: CompanyPrismaRepositoryImpl;

    beforeEach(() => {
        repo = new CompanyPrismaRepositoryImpl();
        jest.clearAllMocks();
    });

    it('should call prisma.upsert with correct data on save', async () => {
        const cuit = unwrap(CuitVO.create('20123456789'));
        const name = unwrap(CompanyNameVO.create('TestCo'));
        const type = unwrap(CompanyTypeVO.create('PYME'));
        const date = unwrap(AdhesionDateVO.create(new Date('2024-01-01')));
        const accounts = [unwrap(AccountNumberVO.create('112233445566'))];

        const company = unwrap(
            Company.create(cuit, name, type, accounts, 'uuid-1', date.getValue())
        );

        await repo.save(company);

        expect(prisma.company.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'uuid-1' },
                update: expect.any(Object),
                create: expect.any(Object),
            }),
        );
    });

    it('should map database records to domain companies in findCompaniesByAdhesionDateRange', async () => {
        (prisma.company.findMany as jest.Mock).mockResolvedValue([
            {
                id: 'uuid-1',
                cuit: '20123456789',
                name: 'TestCo',
                type: 'PYME',
                dateOfAddition: new Date('2024-01-01'),
                accounts: [{ number: '111-222' }],
            },
        ]);

        const companies = await repo.findCompaniesByAdhesionDateRange(
            new Date('2024-01-01'),
            new Date('2024-12-31'),
        );

        expect(prisma.company.findMany).toHaveBeenCalledWith({
            where: {
                dateOfAddition: {
                    gte: new Date('2024-01-01'),
                    lte: new Date('2024-12-31'),
                },
            },
            include: { accounts: true },
        });

        expect(companies[0]).toBeInstanceOf(Company);
        expect(companies[0].cuit.getValue()).toBe('20123456789');
    });

    it('should map database records to domain companies in findByIds', async () => {
        (prisma.company.findMany as jest.Mock).mockResolvedValue([
            {
                id: 'uuid-2',
                cuit: '20987654321',
                name: 'AnotherCo',
                type: 'CORPORATIVA',
                dateOfAddition: new Date('2024-05-05'),
                accounts: [{ number: '333-444' }],
            },
        ]);

        const companies = await repo.findByIds(['uuid-2']);

        expect(prisma.company.findMany).toHaveBeenCalledWith({
            where: { id: { in: ['uuid-2'] } },
            include: { accounts: true },
        });

        expect(companies[0]).toBeInstanceOf(Company);
        expect(companies[0].name.getValue()).toBe('AnotherCo');
    });

    it('should filter out invalid domain objects in toDomain', async () => {
        (prisma.company.findMany as jest.Mock).mockResolvedValue([
            {
                id: 'uuid-3',
                cuit: 'invalid-cuit',
                name: 'BadCo',
                type: 'PYME',
                dateOfAddition: new Date(),
                accounts: [],
            },
        ]);

        const companies = await repo.findByIds(['uuid-3']);
        expect(companies).toHaveLength(0);
    });
});
