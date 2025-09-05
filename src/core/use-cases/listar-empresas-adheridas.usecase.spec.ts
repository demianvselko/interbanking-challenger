import { ListarEmpresasAdheridasUseCase } from './listar-empresas-adheridas.usecase';
import { Empresa } from '@core/entities/empresa.entity';

describe('ListarEmpresasAdheridasUseCase', () => {
    let empresaRepo: any;
    let useCase: ListarEmpresasAdheridasUseCase;

    beforeEach(() => {
        empresaRepo = {
            findAdheridasBetween: jest.fn(),
        };
        useCase = new ListarEmpresasAdheridasUseCase(empresaRepo);
    });

    it('should use provided from and to dates', async () => {
        const from = new Date('2024-05-01');
        const to = new Date('2024-06-01');
        const empresas: Empresa[] = [{ id: 1 } as Empresa];
        empresaRepo.findAdheridasBetween.mockResolvedValue(empresas);

        const result = await useCase.execute(from, to);

        expect(empresaRepo.findAdheridasBetween).toHaveBeenCalledWith(from, to);
        expect(result).toBe(empresas);
    });

    it('should use last month as default from date and now as default to date', async () => {
        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        const empresas: Empresa[] = [{ id: 2 } as Empresa];
        empresaRepo.findAdheridasBetween.mockResolvedValue(empresas);

        // Mock Date and subMonths
        jest.spyOn(global, 'Date').mockImplementation(() => now as any);

        const result = await useCase.execute();

        // Allow some leeway for date-fns subMonths
        expect(empresaRepo.findAdheridasBetween.mock.calls[0][0].getMonth()).toBe(lastMonth.getMonth());
        expect(empresaRepo.findAdheridasBetween.mock.calls[0][1]).toEqual(now);
        expect(result).toBe(empresas);

        jest.restoreAllMocks();
    });

    it('should use provided from date and default to date', async () => {
        const from = new Date('2024-05-01');
        const now = new Date();
        empresaRepo.findAdheridasBetween.mockResolvedValue([]);

        jest.spyOn(global, 'Date').mockImplementation(() => now as any);

        await useCase.execute(from);

        expect(empresaRepo.findAdheridasBetween).toHaveBeenCalledWith(from, now);

        jest.restoreAllMocks();
    });

    it('should use default from date and provided to date', async () => {
        const to = new Date('2024-06-01');
        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        empresaRepo.findAdheridasBetween.mockResolvedValue([]);

        jest.spyOn(global, 'Date').mockImplementation(() => now as any);

        await useCase.execute(undefined, to);

        expect(empresaRepo.findAdheridasBetween.mock.calls[0][0].getMonth()).toBe(lastMonth.getMonth());
        expect(empresaRepo.findAdheridasBetween.mock.calls[0][1]).toEqual(to);

        jest.restoreAllMocks();
    });
});