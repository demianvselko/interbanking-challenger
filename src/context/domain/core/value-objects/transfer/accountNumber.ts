export class AccountNumberVO {
    private readonly value: string;

    constructor(value: string) {
        if (!/^[0-9]{10,20}$/.test(value)) {
            throw new Error('Account number must be between 10 and 20 digits');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
