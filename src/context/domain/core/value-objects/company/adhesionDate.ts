export class AdhesionDateVO {
    private readonly value: Date;

    constructor(value: Date) {
        const now = new Date();
        if (value > now) {
            throw new Error('Adhesion date cannot be in the future');
        }
        this.value = value;
    }

    getValue(): Date {
        return this.value;
    }

    toISOString(): string {
        return this.value.toISOString();
    }
}
