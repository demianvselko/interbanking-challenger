import { ListarEmpresasConTransferenciasUseCase } from './listar-empresas-transferencias.usecase';
import { Empresa } from '@core/entities/empresa.entity';
import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';
import { TransferenciaRepository } from '@core/ports/repositories/transferencia.repository';
const { getLastMonthDateRange } = require('./helpers/date-range.helper');

jest.mock('./helpers/date-range.helper', () => ({
    getLastMonthDateRange: jest.fn(() => [new Date('2024-05-01'), new Date('2024-05-31')]),
}));

describe('ListarEmpresasConTransferenciasUseCase', () => {
    let empresaRepo: jest.Mocked<EmpresaRepository>;
    let transferenciaRepo: jest.Mocked<TransferenciaRepository>;
    let useCase: ListarEmpresasConTransferenciasUseCase;

    beforeEach(() => {
        empresaRepo = {
            findByCUIT: jest.fn(),
        } as any;

        transferenciaRepo = {
            findByDateRange: jest.fn(),
        } as any;

        useCase = new ListarEmpresasConTransferenciasUseCase(empresaRepo, transferenciaRepo);
    });

    it('should return empresas with transferencias in given date range', async () => {
        const transferencias = [
            { idEmpresa: '123' },
            { idEmpresa: '456' },
            { idEmpresa: '123' },
        ];
        const empresa1 = { cuit: '123', nombre: 'Empresa 1' } as unknown as Empresa;
        const empresa2 = { cuit: '456', nombre: 'Empresa 2' } as unknown as Empresa;

        transferenciaRepo.findByDateRange.mockResolvedValue(transferencias as any);
        empresaRepo.findByCUIT.mockImplementation(async (id) => {
            if (id === '123') return empresa1;
            if (id === '456') return empresa2;
            return null;
        });

        const result = await useCase.execute(new Date('2024-05-01'), new Date('2024-05-31'));
        expect(transferenciaRepo.findByDateRange).toHaveBeenCalledWith(
            new Date('2024-05-01'),
            new Date('2024-05-31')
        );
        expect(empresaRepo.findByCUIT).toHaveBeenCalledTimes(2);
        expect(result).toEqual([empresa1, empresa2]);
    });

    it('should use getLastMonthDateRange if no dates are provided', async () => {
        const transferencias = [{ idEmpresa: '789' }];
        const empresa = { cuit: '789', nombre: 'Empresa 3' } as unknown as Empresa;

        transferenciaRepo.findByDateRange.mockResolvedValue(transferencias as any);
        empresaRepo.findByCUIT.mockResolvedValue(empresa);

        const result = await useCase.execute();
        expect(getLastMonthDateRange).toHaveBeenCalled();
        expect(transferenciaRepo.findByDateRange).toHaveBeenCalledWith(
            new Date('2024-05-01'),
            new Date('2024-05-31')
        );
        expect(result).toEqual([empresa]);
    });

    it('should return empty array if no transferencias found', async () => {
        transferenciaRepo.findByDateRange.mockResolvedValue([]);
        const result = await useCase.execute(new Date('2024-05-01'), new Date('2024-05-31'));
        expect(result).toEqual([]);
        expect(empresaRepo.findByCUIT).not.toHaveBeenCalled();
    });

    it('should skip empresas not found by CUIT', async () => {
        const transferencias = [{ idEmpresa: '111' }, { idEmpresa: '222' }];
        transferenciaRepo.findByDateRange.mockResolvedValue(transferencias as any);
        empresaRepo.findByCUIT.mockImplementation(async (id) => {
            if (id === '111') return { cuit: '111', nombre: 'Empresa 111' } as unknown as Empresa;
            return null;
        });

        const result = await useCase.execute(new Date('2024-05-01'), new Date('2024-05-31'));
        expect(result).toEqual([{ cuit: '111', nombre: 'Empresa 111' }]);
    });
});