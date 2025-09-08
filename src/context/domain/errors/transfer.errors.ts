export class TransferError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TransferError';
    }
}

export class TransferErrors {
    static readonly SAME_ACCOUNT = new TransferError(
        'Accounts cannot be the same'
    );

    static readonly NEGATIVE_AMOUNT = new TransferError(
        'The transfer amount must be greater than zero'
    );

}
