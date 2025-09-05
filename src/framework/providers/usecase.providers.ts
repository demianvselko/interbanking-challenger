import { Provider } from '@nestjs/common';
import {
  REGISTRAR_EMPRESA_USECASE,
  LISTAR_ADHERIDAS_USECASE,
  LISTAR_CON_TRANSFERENCIAS_USECASE,
  EMPRESA_REPOSITORY,
  TRANSFERENCIA_REPOSITORY,
} from './tokens';
import { RegistrarEmpresaUseCase } from '@core/use-cases/registrar-empresa.usecase';
import { ListarEmpresasAdheridasUseCase } from '@core/use-cases/listar-empresas-adheridas.usecase';
import { ListarEmpresasConTransferenciasUseCase } from '@core/use-cases/listar-empresas-transferencias.usecase';

export const UseCaseProviders: Provider[] = [
  {
    provide: REGISTRAR_EMPRESA_USECASE,
    useFactory: (empresaRepo) => new RegistrarEmpresaUseCase(empresaRepo),
    inject: [EMPRESA_REPOSITORY],
  },
  {
    provide: LISTAR_ADHERIDAS_USECASE,
    useFactory: (empresaRepo) =>
      new ListarEmpresasAdheridasUseCase(empresaRepo),
    inject: [EMPRESA_REPOSITORY],
  },
  {
    provide: LISTAR_CON_TRANSFERENCIAS_USECASE,
    useFactory: (empresaRepo, transferenciaRepo) =>
      new ListarEmpresasConTransferenciasUseCase(
        empresaRepo,
        transferenciaRepo,
      ),
    inject: [EMPRESA_REPOSITORY, TRANSFERENCIA_REPOSITORY],
  },
];
