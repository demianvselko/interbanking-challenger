import { Provider } from '@nestjs/common';
import { EMPRESA_REPOSITORY, TRANSFERENCIA_REPOSITORY } from './tokens';
import { EmpresaJsonRepositoryAdapter } from '@infrastructure/persistence/json/empresa.repository.json.adapter';
import { TransferenciaJsonRepositoryAdapter } from '@infrastructure/persistence/json/transferencia.repository.json.adapter';

export const RepositoryProviders: Provider[] = [
  {
    provide: EMPRESA_REPOSITORY,
    useClass: EmpresaJsonRepositoryAdapter,
  },
  {
    provide: TRANSFERENCIA_REPOSITORY,
    useClass: TransferenciaJsonRepositoryAdapter,
  },
];
