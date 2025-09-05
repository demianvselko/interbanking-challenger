import { Transferencia } from '@core/entities/transferencia.entity';
export abstract class TransferenciaRepository {
  abstract findByEmpresaAndDateRange(
    idEmpresa: string,
    from: Date,
    to: Date,
  ): Promise<Transferencia[]>;
  abstract findByDateRange(from: Date, to: Date): Promise<Transferencia[]>;
  abstract save(transferencia: Transferencia): Promise<void>;
}
