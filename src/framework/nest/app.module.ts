import { Module } from '@nestjs/common';
import { EmpresaController } from '@application/controllers/empresas.controller';
import { RepositoryProviders } from '@framework/providers/repository.providers';
import { UseCaseProviders } from '@framework/providers/usecase.providers';

@Module({
  imports: [],
  controllers: [EmpresaController],
  providers: [
    ...RepositoryProviders,
    ...UseCaseProviders,
  ],
})
export class AppModule { }
