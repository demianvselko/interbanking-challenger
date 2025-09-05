export class MontoVO {
    private readonly value: number;

    constructor(value: number) {
        if (typeof value !== 'number' || !isFinite(value)) throw new Error('Monto inválido');
        if (value <= 0) throw new Error('El monto debe ser mayor a 0');
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
