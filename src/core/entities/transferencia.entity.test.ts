import { Transferencia } from './transferencia.entity';

class MontoVOMock {
    constructor(private value: number) { }
    getValue() {
        return this.value;
    }
}

describe('Transferencia', () => {
    const id = 'tr-123';
    const idEmpresa = 'emp-456';
    const cuentaDebito = 'deb-789';
    const cuentaCredito = 'cred-012';
    const importeValue = 1000;
    const importe = new MontoVOMock(importeValue) as any;
    const fecha = new Date('2024-06-01T12:00:00Z');

    it('should create an instance with correct properties', () => {
        const transferencia = new Transferencia(
            id,
            idEmpresa,
            cuentaDebito,
            cuentaCredito,
            importe,
            fecha
        );

        expect(transferencia.id).toBe(id);
        expect(transferencia.idEmpresa).toBe(idEmpresa);
        expect(transferencia.cuentaDebito).toBe(cuentaDebito);
        expect(transferencia.cuentaCredito).toBe(cuentaCredito);
        expect(transferencia.importe).toBe(importe);
        expect(transferencia.fecha).toBe(fecha);
    });

    it('should return correct primitives from toPrimitives()', () => {
        const transferencia = new Transferencia(
            id,
            idEmpresa,
            cuentaDebito,
            cuentaCredito,
            importe,
            fecha
        );

        const primitives = transferencia.toPrimitives();

        expect(primitives).toEqual({
            id,
            idEmpresa,
            cuentaDebito,
            cuentaCredito,
            importe: importeValue,
            fecha: fecha.toISOString(),
        });
    });
});