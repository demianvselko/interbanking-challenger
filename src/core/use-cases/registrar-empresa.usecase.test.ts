import { RegistrarEmpresaUseCase } from './registrar-empresa.usecase';
import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';
import { Empresa } from '@core/entities/empresa.entity';
import { CuitVO } from '@core/value-objects/cuit.vo';

describe('RegistrarEmpresaUseCase', () => {
    let useCase: RegistrarEmpresaUseCase;
    let empresaRepo: jest.Mocked<EmpresaRepository>;

    beforeEach(() => {
        empresaRepo = {
            existsByCUIT: jest.fn(),
            findByCUIT: jest.fn(),
            findAdheridasBetween: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<EmpresaRepository>;

        useCase = new RegistrarEmpresaUseCase(empresaRepo);
    });

    it('debe crear una empresa nueva si el CUIT no existe', async () => {
        empresaRepo.existsByCUIT.mockResolvedValue(false);

        const dto = {
            cuit: '12345678901',
            razonSocial: 'Empresa Test',
            tipo: 'PYME' as const,
        };

        const result = await useCase.execute(dto);

        expect(result).toBeInstanceOf(Empresa);
        expect(result.razonSocial).toBe(dto.razonSocial);
        expect(result.tipo).toBe(dto.tipo);
        expect(result.cuit.getValue()).toBe(dto.cuit);
        expect(empresaRepo.save).toHaveBeenCalledWith(result);
    });

    it('debe lanzar un error si el CUIT ya existe', async () => {
        empresaRepo.existsByCUIT.mockResolvedValue(true);

        const dto = {
            cuit: '12345678901',
            razonSocial: 'Empresa Test',
            tipo: 'CORPORATIVA' as const,
        };

        await expect(useCase.execute(dto)).rejects.toThrow(
            'Empresa con ese CUIT ya existe'
        );
        expect(empresaRepo.save).not.toHaveBeenCalled();
    });
});
