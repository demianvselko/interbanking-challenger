import { TransferenciaRepository } from './transferencia.repository';
import { Transferencia } from '@core/entities/transferencia.entity';
import { MontoVO } from '@core/value-objects/monto.vo';

class MockTransferenciaRepository extends TransferenciaRepository {
    private transferencias: Transferencia[] = [];

    async findByEmpresaAndDateRange(
        idEmpresa: string,
        from: Date,
        to: Date,
    ): Promise<Transferencia[]> {
        return this.transferencias.filter(
            (t) =>
                t.idEmpresa === idEmpresa &&
                t.fecha >= from &&
                t.fecha <= to,
        );
    }

    async findByDateRange(from: Date, to: Date): Promise<Transferencia[]> {
        return this.transferencias.filter(
            (t) => t.fecha >= from && t.fecha <= to,
        );
    }

    async save(transferencia: Transferencia): Promise<void> {
        this.transferencias.push(transferencia);
    }
}

describe('TransferenciaRepository', () => {
    let repo: MockTransferenciaRepository;
    let transferenciaSample: Transferencia;

    beforeEach(() => {
        repo = new MockTransferenciaRepository();
        transferenciaSample = new Transferencia(
            't1',
            'empresa-1',
            '123456',
            '654321',
            new MontoVO(1000),
            new Date('2024-06-15'),
        );
    });

    test('save and findByEmpresaAndDateRange should return the transferencia', async () => {
        await repo.save(transferenciaSample);
        const from = new Date('2024-06-01');
        const to = new Date('2024-06-30');
        const result = await repo.findByEmpresaAndDateRange('empresa-1', from, to);
        expect(result).toContain(transferenciaSample);
    });

    test('findByEmpresaAndDateRange should return empty if empresa does not match', async () => {
        await repo.save(transferenciaSample);
        const from = new Date('2024-06-01');
        const to = new Date('2024-06-30');
        const result = await repo.findByEmpresaAndDateRange('empresa-2', from, to);
        expect(result).toEqual([]);
    });

    test('findByDateRange should return transferencias in range', async () => {
        await repo.save(transferenciaSample);
        const from = new Date('2024-06-01');
        const to = new Date('2024-06-30');
        const result = await repo.findByDateRange(from, to);
        expect(result).toContain(transferenciaSample);
    });

    test('findByDateRange should return empty if none in range', async () => {
        await repo.save(transferenciaSample);
        const from = new Date('2024-07-01');
        const to = new Date('2024-07-31');
        const result = await repo.findByDateRange(from, to);
        expect(result).toEqual([]);
    });
});
