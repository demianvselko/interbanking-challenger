import { Empresa } from '@core/entities/empresa.entity';

export abstract class EmpresaRepository {
  abstract findByCUIT(cuit: string): Promise<Empresa | null>;
  abstract existsByCUIT(cuit: string): Promise<boolean>;
  abstract findAdheridasBetween(from: Date, to: Date): Promise<Empresa[]>;
  abstract save(empresa: Empresa): Promise<void>;
}
