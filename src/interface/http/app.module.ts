import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { FindCompaniesByAdhesionUseCase } from '@application/company/useCases/getCompaniesAdheredInLastMonth.useCase';
import { FindCompaniesWithTransfersUseCase } from '@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { TransferRepositoryImpl } from '@infrastructure/repositories/json/transfer.repository.impl';
import { CompanyRepository } from '@domain/ports/company.repository';
import { TransferRepository } from '@domain/ports/transfer.repository';


import { PrismaTransferRepositoryImpl } from '@infrastructure/repositories/prisma/transfer.repository.impl';
import { CompanyPrismaRepositoryImpl } from '@infrastructure/repositories/prisma/company.repository.impl';


@Module({
  controllers: [CompanyController],
  providers: [
    CompanyPrismaRepositoryImpl,
    PrismaTransferRepositoryImpl,

    { provide: CompanyRepository, useExisting: CompanyPrismaRepositoryImpl },
    { provide: TransferRepository, useExisting: PrismaTransferRepositoryImpl },

    CreateCompanyUseCase,
    FindCompaniesByAdhesionUseCase,
    FindCompaniesWithTransfersUseCase,
  ],
})
export class AppModule { }
