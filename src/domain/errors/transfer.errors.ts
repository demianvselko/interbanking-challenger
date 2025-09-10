export class TransferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransferError';
  }
}

export const TransferErrors = {
  SAME_ACCOUNT: new TransferError('Accounts cannot be the same'),
  NEGATIVE_AMOUNT: new TransferError(
    'The transfer amount must be greater than zero',
  ),
};
