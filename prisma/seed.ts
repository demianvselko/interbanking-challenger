import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.resolve(__dirname, '..', 'src', 'infrastructure', 'data');

    const companiesRaw = fs.readFileSync(path.join(dataPath, 'companies.json'), 'utf-8');
    const companies = JSON.parse(companiesRaw) as Array<{
        id?: string;
        cuit: string;
        name: string;
        type: string;
        accounts?: string[];
        dateOfAddition?: string;
    }>;

    for (const c of companies) {
        await prisma.company.upsert({
            where: { cuit: c.cuit },
            update: {},
            create: {
                id: c.id ?? undefined,
                cuit: c.cuit,
                name: c.name,
                type: c.type,
                dateOfAddition: c.dateOfAddition ? new Date(c.dateOfAddition) : new Date(),
                accounts: {
                    create: (c.accounts || []).map((num) => ({ number: num })),
                },
            },
            include: { accounts: true },
        });
    }

    const transfersRaw = fs.readFileSync(path.join(dataPath, 'transfers.json'), 'utf-8');
    const transfers = JSON.parse(transfersRaw) as Array<{
        companyId?: string;
        companyCuit?: string;
        debitAccount: string;
        creditAccount: string;
        amount: number;
        date: string;
    }>;

    for (const t of transfers) {
        const company = t.companyId
            ? await prisma.company.findUnique({ where: { id: t.companyId } })
            : t.companyCuit
                ? await prisma.company.findUnique({ where: { cuit: t.companyCuit } })
                : null;

        if (!company) {
            console.warn('Skipping transfer: company not found', t);
            continue;
        }

        await prisma.transfer.create({
            data: {
                companyId: company.id,
                debitAccount: t.debitAccount,
                creditAccount: t.creditAccount,
                amount: t.amount,
                date: new Date(t.date),
            },
        });
    }

    console.log('Seed finished');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
