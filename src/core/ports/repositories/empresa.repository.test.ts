import { EmpresaRepository } from './empresa.repository';
import { Empresa } from '@core/entities/empresa.entity';
import { CuitVO } from '@core/value-objects/cuit.vo';

class MockEmpresaRepository extends EmpresaRepository {
    private empresas: Empresa[] = [];

    async findByCUIT(cuit: string): Promise<Empresa | null> {
        return this.empresas.find(e => e.cuit.getValue() === cuit) || null;
    }

    async existsByCUIT(cuit: string): Promise<boolean> {
        return this.empresas.some(e => e.cuit.getValue() === cuit);
    }

    async findAdheridasBetween(from: Date, to: Date): Promise<Empresa[]> {
        return this.empresas.filter(
            e => e.fechaAdhesion >= from && e.fechaAdhesion <= to,
        );
    }

    async save(empresa: Empresa): Promise<void> {
        this.empresas.push(empresa);
    }
}

describe('EmpresaRepository', () => {
    let repo: MockEmpresaRepository;
    let empresaSample: Empresa;

    beforeEach(() => {
        repo = new MockEmpresaRepository();
        empresaSample = new Empresa(
            new CuitVO('12345678901'),
            'Empresa Test',
            new Date('2024-06-01'),
            'PYME',
        );
    });

    test('save and findByCUIT', async () => {
        await repo.save(empresaSample);
        const found = await repo.findByCUIT('12345678901');
        expect(found).toEqual(empresaSample);
    });

    test('existsByCUIT returns true if empresa exists', async () => {
        await repo.save(empresaSample);
        const exists = await repo.existsByCUIT('12345678901');
        expect(exists).toBe(true);
    });

    test('existsByCUIT returns false if empresa does not exist', async () => {
        const exists = await repo.existsByCUIT('00000000000');
        expect(exists).toBe(false);
    });

    test('findAdheridasBetween returns empresas in date range', async () => {
        await repo.save(empresaSample);
        const from = new Date('2024-05-01');
        const to = new Date('2024-07-01');
        const result = await repo.findAdheridasBetween(from, to);
        expect(result).toContain(empresaSample);
    });

    test('findAdheridasBetween returns empty array if none in range', async () => {
        await repo.save(empresaSample);
        const from = new Date('2023-01-01');
        const to = new Date('2023-12-31');
        const result = await repo.findAdheridasBetween(from, to);
        expect(result).toEqual([]);
    });
});
