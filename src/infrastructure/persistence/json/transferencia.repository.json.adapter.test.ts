import { TransferenciaJsonRepositoryAdapter } from './transferencia.repository.json.adapter';
import { Transferencia } from '@core/entities/transferencia.entity';
import { MontoVO } from '@core/value-objects/monto.vo';

jest.mock('./transferencias.json', () => [
    {
        empresaId: 'empresa1',
        cuentaDebito: 'debito1',
        cuentaCredito: 'credito1',
        importe: 100,
        fecha: '2024-06-01T00:00:00.000Z',
    },
    {
        empresaId: 'empresa2',
        cuentaDebito: 'debito2',
        cuentaCredito: 'credito2',
        importe: 200,
        fecha: '2024-06-05T00:00:00.000Z',
    },
], { virtual: true });

describe('TransferenciaJsonRepositoryAdapter', () => {
    let repo: TransferenciaJsonRepositoryAdapter;

    beforeEach(() => {
        repo = new TransferenciaJsonRepositoryAdapter();
    });

    it('should initialize transferencias from JSON', () => {
        expect((repo as any).transferencias).toHaveLength(2);
        expect((repo as any).transferencias[0]).toBeInstanceOf(Transferencia);
    });

    it('should find by empresa and date range', async () => {
        const from = new Date('2024-06-01');
        const to = new Date('2024-06-02');
        const result = await repo.findByEmpresaAndDateRange('empresa1', from, to);
        expect(result).toHaveLength(1);
        expect(result[0].idEmpresa).toBe('empresa1');
    });

    it('should find by date range', async () => {
        const from = new Date('2024-06-01');
        const to = new Date('2024-06-06');
        const result = await repo.findByDateRange(from, to);
        expect(result).toHaveLength(2);
    });

    it('should save a new transferencia', async () => {
        const transferencia = new Transferencia(
            'id3',
            'empresa3',
            'debito3',
            'credito3',
            new MontoVO(300),
            new Date('2024-06-10'),
        );
        await repo.save(transferencia);
        const all = await repo.findByDateRange(new Date('2024-06-01'), new Date('2024-06-15'));
        expect(all).toContainEqual(expect.objectContaining({ idEmpresa: 'empresa3' }));
    });
});