import { validate } from 'class-validator';
import { DateRangeDto } from './date-range.dto';

describe('DateRangeDto', () => {
    it('should validate when both dates are valid ISO8601 strings', async () => {
        const dto = new DateRangeDto();
        dto.from = '2023-01-01T00:00:00Z';
        dto.to = '2023-12-31T23:59:59Z';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should validate when only "from" is provided and valid', async () => {
        const dto = new DateRangeDto();
        dto.from = '2023-01-01';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should validate when only "to" is provided and valid', async () => {
        const dto = new DateRangeDto();
        dto.to = '2023-12-31';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should validate when neither "from" nor "to" is provided', async () => {
        const dto = new DateRangeDto();

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation when "from" is not a valid ISO8601 string', async () => {
        const dto = new DateRangeDto();
        dto.from = 'invalid-date';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('from');
    });

    it('should fail validation when "to" is not a valid ISO8601 string', async () => {
        const dto = new DateRangeDto();
        dto.to = 'not-a-date';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('to');
    });
});