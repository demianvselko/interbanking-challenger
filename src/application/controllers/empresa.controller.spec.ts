import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaController } from './empresas.controller';
import { CreateEmpresaDto } from '@application/dto/create-empresa.dto';
import { RegistrarEmpresaUseCase } from '@core/use-cases/registrar-empresa.usecase';
import { ListarEmpresasAdheridasUseCase } from '@core/use-cases/listar-empresas-adheridas.usecase';
import { ListarEmpresasConTransferenciasUseCase } from '@core/use-cases/listar-empresas-transferencias.usecase';
import { Empresa } from '@core/entities/empresa.entity';
import { CuitVO } from '@core/value-objects/cuit.vo';

describe('EmpresaController', () => {
    let controller: EmpresaController;
    let registrarUseCase: jest.Mocked<RegistrarEmpresaUseCase>;
    let listarAdheridasUseCase: jest.Mocked<ListarEmpresasAdheridasUseCase>;
    let listarConTransferenciasUseCase: jest.Mocked<ListarEmpresasConTransferenciasUseCase>;

    beforeEach(async () => {
        registrarUseCase = { execute: jest.fn() } as any;
        listarAdheridasUseCase = { execute: jest.fn() } as any;
        listarConTransferenciasUseCase = { execute: jest.fn() } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmpresaController],
            providers: [
                { provide: 'REGISTRAR_EMPRESA_USECASE', useValue: registrarUseCase },
                { provide: 'LISTAR_ADHERIDAS_USECASE', useValue: listarAdheridasUseCase },
                { provide: 'LISTAR_CON_TRANSFERENCIAS_USECASE', useValue: listarConTransferenciasUseCase },
            ],
        }).compile();

        controller = module.get<EmpresaController>(EmpresaController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('registrar', () => {
        it('should call registrarUseCase and return primitives', async () => {
            const dto: CreateEmpresaDto = {
                cuit: '20304050607',
                razonSocial: 'Mi Empresa',
                tipo: 'PYME',
            };
            const mockEmpresa = new Empresa(new CuitVO(dto.cuit), dto.razonSocial, new Date(), dto.tipo);
            registrarUseCase.execute.mockResolvedValue(mockEmpresa);

            const result = await controller.registrar(dto);
            expect(registrarUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(mockEmpresa.toPrimitives());
        });
    });

    describe('getAdheridas', () => {
        it('should call listarAdheridasUseCase and return mapped primitives', async () => {
            const empresa = new Empresa(new CuitVO('20304050607'), 'Empresa A', new Date(), 'PYME');
            listarAdheridasUseCase.execute.mockResolvedValue([empresa]);

            const result = await controller.getAdheridas();
            expect(listarAdheridasUseCase.execute).toHaveBeenCalledWith(undefined, undefined);
            expect(result).toEqual([empresa.toPrimitives()]);
        });
    });

    describe('getConTransferencias', () => {
        it('should call listarConTransferenciasUseCase and return mapped primitives', async () => {
            const empresa = new Empresa(new CuitVO('20304050607'), 'Empresa A', new Date(), 'PYME');
            listarConTransferenciasUseCase.execute.mockResolvedValue([empresa]);

            const result = await controller.getConTransferencias();
            expect(listarConTransferenciasUseCase.execute).toHaveBeenCalledWith(undefined, undefined);
            expect(result).toEqual([empresa.toPrimitives()]);
        });
    });

    describe('getAdheridasUltimoMes', () => {
        it('should call getAdheridas', async () => {
            const spy = jest.spyOn(controller, 'getAdheridas').mockResolvedValue([]);
            const result = await controller.getAdheridasUltimoMes();
            expect(spy).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('getConTransferenciasUltimoMes', () => {
        it('should call getConTransferencias', async () => {
            const spy = jest.spyOn(controller, 'getConTransferencias').mockResolvedValue([]);
            const result = await controller.getConTransferenciasUltimoMes();
            expect(spy).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});
