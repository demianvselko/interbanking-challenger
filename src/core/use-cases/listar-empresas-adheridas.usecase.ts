import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';
import { Empresa } from '@core/entities/empresa.entity';
import { subMonths } from 'date-fns';

export class ListarEmpresasAdheridasUseCase {
    constructor(private readonly empresaRepo: EmpresaRepository) { }

    async execute(from?: Date, to?: Date): Promise<Empresa[]> {
        const now = new Date();
        const fromDate = from ?? subMonths(now, 1);
        const toDate = to ?? now;

        return this.empresaRepo.findAdheridasBetween(fromDate, toDate);
    }
}
