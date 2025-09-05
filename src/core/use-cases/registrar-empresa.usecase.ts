import { Empresa } from '@core/entities/empresa.entity';
import { CuitVO } from '@core/value-objects/cuit.vo';
import { EmpresaRepository } from '@core/ports/repositories/empresa.repository';

interface RegistrarEmpresaDTO {
  cuit: string;
  razonSocial: string;
  tipo: 'PYME' | 'CORPORATIVA';
}

export class RegistrarEmpresaUseCase {
  constructor(private readonly empresaRepo: EmpresaRepository) {}

  async execute(dto: RegistrarEmpresaDTO): Promise<Empresa> {
    const cuitVO = new CuitVO(dto.cuit);

    const exists = await this.empresaRepo.existsByCUIT(cuitVO.getValue());
    if (exists) {
      throw new Error('Empresa con ese CUIT ya existe');
    }

    const empresa = new Empresa(cuitVO, dto.razonSocial, new Date(), dto.tipo);

    await this.empresaRepo.save(empresa);
    return empresa;
  }
}
