import { CuitVO } from '@core/value-objects/cuit.vo';

export class Empresa {
  constructor(
    public readonly cuit: CuitVO,
    public readonly razonSocial: string,
    public readonly fechaAdhesion: Date,
    public readonly tipo: 'PYME' | 'CORPORATIVA',
  ) {}

  toPrimitives() {
    return {
      cuit: this.cuit.getValue(),
      razonSocial: this.razonSocial,
      fechaAdhesion: this.fechaAdhesion.toISOString(),
      tipo: this.tipo,
    };
  }
}
