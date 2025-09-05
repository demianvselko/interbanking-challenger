import { MontoVO } from '@core/value-objects/monto.vo';

export class Transferencia {
    constructor(
        public readonly id: string,
        public readonly idEmpresa: string,
        public readonly cuentaDebito: string,
        public readonly cuentaCredito: string,
        public readonly importe: MontoVO,
        public readonly fecha: Date
    ) { }

    toPrimitives() {
        return {
            id: this.id,
            idEmpresa: this.idEmpresa,
            cuentaDebito: this.cuentaDebito,
            cuentaCredito: this.cuentaCredito,
            importe: this.importe.getValue(),
            fecha: this.fecha.toISOString()
        };
    }
}
