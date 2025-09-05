import { validate } from 'class-validator';
import { CreateEmpresaDto } from './create-empresa.dto';

describe('CreateEmpresaDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '20-12345678-1';
    dto.razonSocial = 'Empresa S.A.';
    dto.fechaAdhesion = '2023-01-01';
    dto.tipo = 'PYME';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid CUIT format', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '2012345678'; // missing last digit
    dto.razonSocial = 'Empresa S.A.';
    dto.tipo = 'PYME';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'cuit')).toBe(true);
  });

  it('should fail for missing razonSocial', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '20-12345678-1';
    dto.tipo = 'PYME';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'razonSocial')).toBe(true);
  });

  it('should allow fechaAdhesion to be optional', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '20-12345678-1';
    dto.razonSocial = 'Empresa S.A.';
    dto.tipo = 'CORPORATIVA';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid fechaAdhesion format', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '20-12345678-1';
    dto.razonSocial = 'Empresa S.A.';
    dto.fechaAdhesion = '01-01-2023'; // not ISO format
    dto.tipo = 'PYME';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'fechaAdhesion')).toBe(true);
  });

  it('should fail for invalid tipo value', async () => {
    const dto = new CreateEmpresaDto();
    dto.cuit = '20-12345678-1';
    dto.razonSocial = 'Empresa S.A.';
    // @ts-expect-error: testing invalid value
    dto.tipo = 'STARTUP';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tipo')).toBe(true);
  });
});
