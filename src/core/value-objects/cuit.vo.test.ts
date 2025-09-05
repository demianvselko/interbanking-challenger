import { CuitVO } from './cuit.vo';

describe('CuitVO', () => {
    it('should create a CuitVO with a valid CUIT (with dashes)', () => {
        const cuit = new CuitVO('20-12345678-3');
        expect(cuit.getValue()).toBe('20123456783');
    });

    it('should create a CuitVO with a valid CUIT (without dashes)', () => {
        const cuit = new CuitVO('20123456783');
        expect(cuit.getValue()).toBe('20123456783');
    });

    it('should trim spaces from CUIT', () => {
        const cuit = new CuitVO(' 20-12345678-3 ');
        expect(cuit.getValue()).toBe('20123456783');
    });

    it('should throw an error for CUIT with less than 11 digits', () => {
        expect(() => new CuitVO('20-1234567-3')).toThrow('CUIT inválido');
    });

    it('should throw an error for CUIT with more than 11 digits', () => {
        expect(() => new CuitVO('20-123456789-3')).toThrow('CUIT inválido');
    });

    it('should throw an error for CUIT with non-digit characters', () => {
        expect(() => new CuitVO('20-1234A678-3')).toThrow('CUIT inválido');
    });

    it('should compare equality of two CuitVO instances with same value', () => {
        const cuit1 = new CuitVO('20-12345678-3');
        const cuit2 = new CuitVO('20123456783');
        expect(cuit1.equals(cuit2)).toBe(true);
    });

    it('should compare inequality of two CuitVO instances with different values', () => {
        const cuit1 = new CuitVO('20-12345678-3');
        const cuit2 = new CuitVO('23-87654321-0');
        expect(cuit1.equals(cuit2)).toBe(false);
    });
});