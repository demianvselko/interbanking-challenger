import { CompanyRepository } from '@domain/ports/company.repository';
import { Company } from '@domain/entities/company';
import { CuitVO } from '@domain/valueObjects/company/cuit';
import { CompanyNameVO } from '@domain/valueObjects/company/companyName';
import { CompanyTypeVO } from '@domain/valueObjects/company/companyTypes';
import { AccountNumberVO } from '@domain/valueObjects/transfer/accountNumber';
import { AdhesionDateVO } from '@domain/valueObjects/company/adhesionDate';
import { prisma } from '@infrastructure/prisma/prisma.client';

export class CompanyPrismaRepositoryImpl implements CompanyRepository {
  async save(company: Company): Promise<void> {
    await prisma.company.upsert({
      where: { id: company.id },
      update: {
        cuit: company.cuit.getValue(),
        name: company.name.getValue(),
        type: company.type.getValue(),
        dateOfAddition: company.dateOfAddition.getValue(),
        accounts: {
          deleteMany: {},
          create: company.accounts.map((acc) => ({
            number: acc.getValue(),
          })),
        },
      },
      create: {
        id: company.id,
        cuit: company.cuit.getValue(),
        name: company.name.getValue(),
        type: company.type.getValue(),
        dateOfAddition: company.dateOfAddition.getValue(),
        accounts: {
          create: company.accounts.map((acc) => ({
            number: acc.getValue(),
          })),
        },
      },
    });
  }

  async findCompaniesByAdhesionDateRange(start: Date, end: Date): Promise<Company[]> {
    const companiesDb = await prisma.company.findMany({
      where: {
        dateOfAddition: {
          gte: start,
          lte: end,
        },
      },
      include: { accounts: true },
    });

    return companiesDb
      .map((c) => this.toDomain(c))
      .filter((res): res is Company => !!res);
  }

  async findByIds(ids: string[]): Promise<Company[]> {
    const companiesDb = await prisma.company.findMany({
      where: { id: { in: ids } },
      include: { accounts: true },
    });

    return companiesDb
      .map((c) => this.toDomain(c))
      .filter((res): res is Company => !!res);
  }

  private toDomain(raw: any): Company | null {
    const cuitR = CuitVO.create(raw.cuit);
    if (!cuitR.ok) return null;

    const nameR = CompanyNameVO.create(raw.name);
    if (!nameR.ok) return null;

    const typeR = CompanyTypeVO.create(raw.type);
    if (!typeR.ok) return null;

    const dateR = AdhesionDateVO.create(raw.dateOfAddition);
    if (!dateR.ok) return null;

    const accounts: AccountNumberVO[] = [];
    for (const acc of raw.accounts || []) {
      const accR = AccountNumberVO.create(acc.number);
      if (accR.ok) accounts.push(accR.value);
    }

    const companyR = Company.create(
      cuitR.value,
      nameR.value,
      typeR.value,
      accounts,
      raw.id,
      raw.dateOfAddition,
    );

    return companyR.ok ? companyR.value : null;
  }
}
