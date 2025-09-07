import { EmpresaJsonRepositoryAdapter } from './empresa.repository.json.adapter';
import { Empresa } from 'context/domain/core/entities/company';
import { CuitVO } from 'context/domain/core/value-objects/company/cuit';

jest.mock('./empresas.json', () => [
    {
        cuit: '20123456789',
        razonSocial: 'Empresa Uno',
        fechaAdhesion: '2023-01-01T00:00:00.000Z',
        tipo: 'PYME',
    },
    {
        cuit: '20987654321',
        razonSocial: 'Empresa Dos',
        fechaAdhesion: '2023-06-15T00:00:00.000Z',
        tipo: 'CORPORATIVA',
    },
], { virtual: true });

describe('EmpresaJsonRepositoryAdapter', () => {
    let repo: EmpresaJsonRepositoryAdapter;

    beforeEach(() => {
        repo = new EmpresaJsonRepositoryAdapter();
    });

    it('findByCUIT returns the correct Empresa', async () => {
        const empresa = await repo.findByCUIT('20123456789');
        expect(empresa).not.toBeNull();
        expect(empresa?.razonSocial).toBe('Empresa Uno');
    });

    it('findByCUIT returns null for non-existent CUIT', async () => {
        const empresa = await repo.findByCUIT('00000000000');
        expect(empresa).toBeNull();
    });

    it('existsByCUIT returns true for existing CUIT', async () => {
        const exists = await repo.existsByCUIT('20987654321');
        expect(exists).toBe(true);
    });

    it('existsByCUIT returns false for non-existent CUIT', async () => {
        const exists = await repo.existsByCUIT('00000000000');
        expect(exists).toBe(false);
    });

    it('findAdheridasBetween returns empresas within date range', async () => {
        const from = new Date('2023-01-01');
        const to = new Date('2023-12-31');
        const empresas = await repo.findAdheridasBetween(from, to);
        expect(empresas.length).toBe(2);
        expect(empresas.map(e => e.razonSocial)).toContain('Empresa Uno');
        expect(empresas.map(e => e.razonSocial)).toContain('Empresa Dos');
    });

    it('findAdheridasBetween returns empty array if none in range', async () => {
        const from = new Date('2022-01-01');
        const to = new Date('2022-12-31');
        const empresas = await repo.findAdheridasBetween(from, to);
        expect(empresas).toEqual([]);
    });

    it('save adds a new empresa', async () => {
        const nuevaEmpresa = new Empresa(
            new CuitVO('20333333333'),
            'Empresa Tres',
            new Date('2024-01-01'),
            'PYME'
        );
        await repo.save(nuevaEmpresa);
        const found = await repo.findByCUIT('20333333333');
        expect(found).not.toBeNull();
        expect(found?.razonSocial).toBe('Empresa Tres');
    });
});