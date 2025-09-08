import { v4 as uuid4 } from 'uuid';
import { AmountVO } from '../value-objects/transfer/amount';
import { AccountNumberVO } from '../value-objects/transfer/accountNumber';
import { Result } from 'context/shraed/result';
import { TransferErrors } from 'context/domain/errors/transfer.errors';

export class Transfer {
  private constructor(
    private readonly _id: string,
    private readonly _companyId: string,
    private readonly _debitAccount: AccountNumberVO,
    private readonly _creditAccount: AccountNumberVO,
    private readonly _amount: AmountVO,
    private readonly _date: Date
  ) { }

  get id(): string { return this._id; }
  get companyId(): string { return this._companyId; }
  get debitAccount(): AccountNumberVO { return this._debitAccount; }
  get creditAccount(): AccountNumberVO { return this._creditAccount; }
  get amount(): number { return this._amount.getValue(); }
  get date(): Date { return this._date; }

  static create(
    companyId: string,
    debitAccount: AccountNumberVO,
    creditAccount: AccountNumberVO,
    amount: AmountVO,
    date: Date = new Date()
  ): Result<Transfer> {
    if (debitAccount.getValue() === creditAccount.getValue()) {
      return Result.fail(TransferErrors.SAME_ACCOUNT);
    }

    const transfer = new Transfer(
      uuid4(),
      companyId,
      debitAccount,
      creditAccount,
      amount,
      date
    );
    return Result.ok(transfer);
  }

  toPrimitives() {
    return {
      id: this._id,
      companyId: this._companyId,
      debitAccount: this._debitAccount.getValue(),
      creditAccount: this._creditAccount.getValue(),
      amount: this._amount.getValue(),
      date: this._date.toISOString(),
    };
  }
}
