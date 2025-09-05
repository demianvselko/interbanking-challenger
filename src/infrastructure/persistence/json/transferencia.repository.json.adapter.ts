import { TransferenciaRepository } from '@core/ports/repositories/transferencia.repository';
import { Transferencia } from '@core/entities/transferencia.entity';
import { MontoVO } from '@core/value-objects/monto.vo';
import transferenciasRaw from './transferencias.json';

export class TransferenciaJsonRepositoryAdapter extends TransferenciaRepository {
    private transferencias: Transferencia[];

    constructor() {
        super();
        this.transferencias = transferenciasRaw.map((t) => new Transferencia(
            crypto.randomUUID(),
            t.empresaId,
            t.cuentaDebito,
            t.cuentaCredito,
            new MontoVO(t.importe),
            new Date(t.fecha),
        ));
    }

    async findByEmpresaAndDateRange(idEmpresa: string, from: Date, to: Date): Promise<Transferencia[]> {
        return this.transferencias.filter(
            (t) => t.idEmpresa === idEmpresa && t.fecha >= from && t.fecha <= to
        );
    }

    async findByDateRange(from: Date, to: Date): Promise<Transferencia[]> {
        return this.transferencias.filter((t) => t.fecha >= from && t.fecha <= to);
    }

    async save(transferencia: Transferencia): Promise<void> {
        this.transferencias.push(transferencia);
    }
}
