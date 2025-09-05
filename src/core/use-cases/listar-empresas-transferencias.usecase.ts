import { Empresa } from '@core/entities/empresa.entity';
import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';
import { TransferenciaRepository } from '@core/ports/repositories/transferencia.repository';
import { getLastMonthDateRange } from './helpers/date-range.helper';

export class ListarEmpresasConTransferenciasUseCase {
    constructor(
        private readonly empresaRepo: EmpresaRepository,
        private readonly transferenciaRepo: TransferenciaRepository
    ) { }

    async execute(from?: Date, to?: Date): Promise<Empresa[]> {
        const [start, end] = from && to ? [from, to] : getLastMonthDateRange();
        const transferencias = await this.transferenciaRepo.findByDateRange(start, end);
        const empresaIds = Array.from(new Set(transferencias.map(t => t.idEmpresa)));
        const empresas: Empresa[] = [];
        for (const id of empresaIds) {
            const empresa = await this.empresaRepo.findByCUIT(id);
            if (empresa) empresas.push(empresa);
        }

        return empresas;
    }
}
