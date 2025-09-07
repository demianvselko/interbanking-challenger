import { Empresa } from './company';

class MockCuitVO {
  constructor(private value: string) { }
  getValue() {
    return this.value;
  }
}

describe('Empresa', () => {
  const cuitValue = '20-12345678-9';
  const razonSocial = 'Empresa S.A.';
  const fechaAdhesion = new Date('2023-01-01T00:00:00.000Z');
  const tipo = 'PYME' as const;

  let empresa: Empresa;

  beforeEach(() => {
    empresa = new Empresa(
      new MockCuitVO(cuitValue) as any,
      razonSocial,
      fechaAdhesion,
      tipo,
    );
  });

  it('should create an instance with correct properties', () => {
    expect(empresa.cuit.getValue()).toBe(cuitValue);
    expect(empresa.razonSocial).toBe(razonSocial);
    expect(empresa.fechaAdhesion).toEqual(fechaAdhesion);
    expect(empresa.tipo).toBe(tipo);
  });

  it('should return primitives with toPrimitives()', () => {
    const result = empresa.toPrimitives();
    expect(result).toEqual({
      cuit: cuitValue,
      razonSocial,
      fechaAdhesion: fechaAdhesion.toISOString(),
      tipo,
    });
  });

  it('should handle tipo CORPORATIVA', () => {
    const empresaCorp = new Empresa(
      new MockCuitVO(cuitValue) as any,
      razonSocial,
      fechaAdhesion,
      'CORPORATIVA',
    );
    expect(empresaCorp.tipo).toBe('CORPORATIVA');
    expect(empresaCorp.toPrimitives().tipo).toBe('CORPORATIVA');
  });
});
