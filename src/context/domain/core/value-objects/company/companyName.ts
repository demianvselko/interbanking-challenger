export class CompanyNameVO {
    private readonly value: string;

    constructor(value: string) {
        if (value.trim().length < 2 || value.trim().length > 100) {
            throw new Error('Company name must be between 2 and 100 characters');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
