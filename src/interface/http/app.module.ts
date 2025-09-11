import { Module } from '@nestjs/common';


import { CompanyRepository } from '@domain/ports/company.repository';
import { TransferRepository } from '@domain/ports/transfer.repository';

import { CompanyPrismaRepositoryImpl } from '@infrastructure/repositories/prisma/company.repository.impl';
import { PrismaTransferRepositoryImpl } from '@infrastructure/repositories/prisma/transfer.repository.impl';

import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { FindCompaniesByAdhesionUseCase } from '@application/company/useCases/getCompaniesAdheredInLastMonth.useCase';
import { FindCompaniesWithTransfersUseCase } from '@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase';
import { AuthModule } from '@infrastructure/auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CompanyController } from './controllers/company.controller';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [CompanyController, AuthController, HealthController],
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
