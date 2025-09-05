import { Controller, Post, Body, Get, Inject, Query } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { CreateEmpresaDto } from '@application/dto/create-empresa.dto';
import { RegistrarEmpresaUseCase } from '@core/use-cases/registrar-empresa.usecase';
import { ListarEmpresasAdheridasUseCase } from '@core/use-cases/listar-empresas-adheridas.usecase';
import { ListarEmpresasConTransferenciasUseCase } from '@core/use-cases/listar-empresas-transferencias.usecase';
import {
  LISTAR_ADHERIDAS_USECASE,
  LISTAR_CON_TRANSFERENCIAS_USECASE,
  REGISTRAR_EMPRESA_USECASE,
} from '@framework/providers/tokens';

@Controller('empresas')
export class EmpresaController {
  constructor(
    @Inject(REGISTRAR_EMPRESA_USECASE)
    private readonly registrarUseCase: RegistrarEmpresaUseCase,

    @Inject(LISTAR_ADHERIDAS_USECASE)
    private readonly listarAdheridasUseCase: ListarEmpresasAdheridasUseCase,

    @Inject(LISTAR_CON_TRANSFERENCIAS_USECASE)
    private readonly listarConTransferenciasUseCase: ListarEmpresasConTransferenciasUseCase,
  ) { }

  @Post('adhesion')
  async registrar(@Body() body: CreateEmpresaDto) {
    const empresa = await this.registrarUseCase.execute(body as any);
    return empresa.toPrimitives();
  }

  @Get('adheridas')
  async getAdheridas(@Query('from') from?: string, @Query('to') to?: string) {
    const fromDate = from ? parseISO(from) : undefined;
    const toDate = to ? parseISO(to) : undefined;

    const empresas = await this.listarAdheridasUseCase.execute(
      fromDate,
      toDate,
    );
    return empresas.map((e) => e.toPrimitives());
  }

  @Get('transferencias')
  async getConTransferencias(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? parseISO(from) : undefined;
    const toDate = to ? parseISO(to) : undefined;

    const empresas = await this.listarConTransferenciasUseCase.execute(
      fromDate,
      toDate,
    );
    return empresas.map((e) => e.toPrimitives());
  }

  @Get('adheridas/ultimo-mes')
  async getAdheridasUltimoMes() {
    return this.getAdheridas();
  }

  @Get('transferencias/ultimo-mes')
  async getConTransferenciasUltimoMes() {
    return this.getConTransferencias();
  }
}
