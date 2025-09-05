import { getLastMonthDateRange } from './date-range.helper';

describe('getLastMonthDateRange', () => {
    it('debe devolver el rango correcto del último mes', () => {
        const [start, end] = getLastMonthDateRange();

        const now = new Date();
        const expectedStartMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const expectedStartYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

        expect(start.getFullYear()).toBe(expectedStartYear);
        expect(start.getMonth()).toBe(expectedStartMonth);
        expect(start.getDate()).toBe(1);
        expect(start.getHours()).toBe(0);
        expect(start.getMinutes()).toBe(0);
        expect(start.getSeconds()).toBe(0);
        expect(start.getMilliseconds()).toBe(0);

        expect(end.getFullYear()).toBe(expectedStartYear);
        expect(end.getMonth()).toBe(expectedStartMonth);
        expect(end.getHours()).toBe(23);
        expect(end.getMinutes()).toBe(59);
        expect(end.getSeconds()).toBe(59);
        expect(end.getMilliseconds()).toBe(999);

        expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime());
    });
});
