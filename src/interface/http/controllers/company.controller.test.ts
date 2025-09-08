import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../controllers/company.controller';
import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { FindCompaniesByAdhesionUseCase } from '@application/company/useCases/getCompaniesAdheredInLastMonth.useCase';
import { FindCompaniesWithTransfersUseCase } from '@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase';
import { Result } from '@context/shared/result';

describe('CompanyController', () => {
    let controller: CompanyController;
    let createCompanyUseCase: CreateCompanyUseCase;
    let findByAdhesionUseCase: FindCompaniesByAdhesionUseCase;
    let findWithTransfersUseCase: FindCompaniesWithTransfersUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompanyController],
            providers: [
                {
                    provide: CreateCompanyUseCase,
                    useValue: { execute: jest.fn() }
                },
                {
                    provide: FindCompaniesByAdhesionUseCase,
                    useValue: { execute: jest.fn() }
                },
                {
                    provide: FindCompaniesWithTransfersUseCase,
                    useValue: { execute: jest.fn() }
                }
            ]
        }).compile();

        controller = module.get<CompanyController>(CompanyController);
        createCompanyUseCase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
        findByAdhesionUseCase = module.get<FindCompaniesByAdhesionUseCase>(FindCompaniesByAdhesionUseCase);
        findWithTransfersUseCase = module.get<FindCompaniesWithTransfersUseCase>(FindCompaniesWithTransfersUseCase);
    });

    describe('create', () => {
        it('should return company primitives on success', async () => {
            const mockCompany = { toPrimitives: () => ({ name: 'Test Company' }) };
            (createCompanyUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockCompany));

            const result = await controller.create({ cuit: '123', name: 'Test', type: 'PYME', accounts: [] });

            expect(result).toEqual({ name: 'Test Company' });
            expect(createCompanyUseCase.execute).toHaveBeenCalled();
        });

        it('should return error if use case fails', async () => {
            (createCompanyUseCase.execute as jest.Mock).mockResolvedValue(Result.fail('CUIT invalid'));

            const result = await controller.create({ cuit: 'invalid', name: 'Test', type: 'PYME', accounts: [] });

            expect(result).toEqual({ error: 'CUIT invalid' });
        });
    });

    describe('adhesion', () => {
        it('should return array of company primitives on success', async () => {
            const mockCompanies = [
                { toPrimitives: () => ({ name: 'Company A' }) },
                { toPrimitives: () => ({ name: 'Company B' }) },
            ];
            (findByAdhesionUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockCompanies));

            const result = await controller.adhesion();

            expect(result).toEqual([{ name: 'Company A' }, { name: 'Company B' }]);
            expect(findByAdhesionUseCase.execute).toHaveBeenCalled();
        });

        it('should return error if use case fails', async () => {
            (findByAdhesionUseCase.execute as jest.Mock).mockResolvedValue(Result.fail('DB error'));

            const result = await controller.adhesion();

            expect(result).toEqual({ error: 'DB error' });
        });
    });

    describe('transfers', () => {
        it('should return array of company primitives on success', async () => {
            const mockCompanies = [
                { toPrimitives: () => ({ name: 'Company X' }) },
            ];
            (findWithTransfersUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockCompanies));

            const result = await controller.transfers();

            expect(result).toEqual([{ name: 'Company X' }]);
            expect(findWithTransfersUseCase.execute).toHaveBeenCalled();
        });

        it('should return error if use case fails', async () => {
            (findWithTransfersUseCase.execute as jest.Mock).mockResolvedValue(Result.fail('DB error'));

            const result = await controller.transfers();

            expect(result).toEqual({ error: 'DB error' });
        });
    });
});
