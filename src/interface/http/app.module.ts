import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { FindCompaniesByAdhesionUseCase } from '@application/company/useCases/getCompaniesAdheredInLastMonth.useCase';
import { FindCompaniesWithTransfersUseCase } from '@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { TransferRepositoryImpl } from '@infrastructure/repositories/json/transfer.repository.impl';
import { CompanyRepository } from '@context/ports/company.repository';
import { TransferRepository } from '@context/ports/transfer.repository';

@Module({
    controllers: [CompanyController],
    providers: [
        CompanyRepositoryImpl,
        TransferRepositoryImpl,

        { provide: CompanyRepository, useExisting: CompanyRepositoryImpl },
        { provide: TransferRepository, useExisting: TransferRepositoryImpl },

        CreateCompanyUseCase,
        FindCompaniesByAdhesionUseCase,
        FindCompaniesWithTransfersUseCase,
    ],
})
export class AppModule { }
