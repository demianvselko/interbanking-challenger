import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';
import { Empresa } from '@core/entities/empresa.entity';
import { CuitVO } from '@core/value-objects/cuit.vo';
import empresasRaw from './empresas.json';

function parseTipo(tipo: string): 'PYME' | 'CORPORATIVA' {
    if (tipo === 'PYME' || tipo === 'CORPORATIVA') return tipo;
    throw new Error(`Tipo inválido en JSON: ${tipo}`);
}

export class EmpresaJsonRepositoryAdapter extends EmpresaRepository {
    private empresas: Empresa[];

    constructor() {
        super();
        this.empresas = empresasRaw.map((e) => new Empresa(
            new CuitVO(e.cuit),
            e.razonSocial,
            new Date(e.fechaAdhesion),
            parseTipo(e.tipo),
        ));
    }

    async findByCUIT(cuit: string): Promise<Empresa | null> {
        return this.empresas.find((e) => e.cuit.getValue() === cuit) || null;
    }

    async existsByCUIT(cuit: string): Promise<boolean> {
        return this.empresas.some((e) => e.cuit.getValue() === cuit);
    }

    async findAdheridasBetween(from: Date, to: Date): Promise<Empresa[]> {
        return this.empresas.filter((e) => e.fechaAdhesion >= from && e.fechaAdhesion <= to);
    }

    async save(empresa: Empresa): Promise<void> {
        this.empresas.push(empresa);
    }
}
