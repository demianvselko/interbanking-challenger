import { MontoVO } from './monto.vo';

describe('MontoVO', () => {
    it('should create an instance with a valid positive number', () => {
        const monto = new MontoVO(100);
        expect(monto.getValue()).toBe(100);
    });

    it('should throw error if value is not a number', () => {
        // @ts-expect-error
        expect(() => new MontoVO('abc')).toThrow('Monto inválido');
        // @ts-expect-error
        expect(() => new MontoVO(null)).toThrow('Monto inválido');
        // @ts-expect-error
        expect(() => new MontoVO(undefined)).toThrow('Monto inválido');
    });

    it('should throw error if value is not finite', () => {
        expect(() => new MontoVO(Infinity)).toThrow('Monto inválido');
        expect(() => new MontoVO(NaN)).toThrow('Monto inválido');
    });

    it('should throw error if value is zero or negative', () => {
        expect(() => new MontoVO(0)).toThrow('El monto debe ser mayor a 0');
        expect(() => new MontoVO(-10)).toThrow('El monto debe ser mayor a 0');
    });
});