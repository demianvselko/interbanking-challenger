import { v4 as uuid4 } from 'uuid';
import { AmountVO } from '../value-objects/transfer/amount';
import { AccountNumberVO } from '../value-objects/transfer/accountNumber';

export class Transfer {
  private readonly _id: string;
  private readonly _companyId: string;
  private readonly _debitAccount: AccountNumberVO;
  private readonly _creditAccount: AccountNumberVO;
  private readonly _amount: AmountVO;
  private readonly _date: Date;

  private constructor(
    id: string,
    companyId: string,
    debitAccount: AccountNumberVO,
    creditAccount: AccountNumberVO,
    amount: AmountVO,
    date: Date
  ) {
    this._id = id;
    this._companyId = companyId;
    this._debitAccount = debitAccount;
    this._creditAccount = creditAccount;
    this._amount = amount;
    this._date = date;
  }

  static create(
    companyId: string,
    debitAccount: AccountNumberVO,
    creditAccount: AccountNumberVO,
    amount: AmountVO
  ): Transfer {
    if (debitAccount.getValue() === creditAccount.getValue()) {
      throw new Error('Debit and credit accounts cannot be the same');
    }

    return new Transfer(
      uuid4(),
      companyId,
      debitAccount,
      creditAccount,
      amount,
      new Date()
    );
  }

  get id(): string {
    return this._id;
  }

  get companyId(): string {
    return this._companyId;
  }

  get debitAccount(): AccountNumberVO {
    return this._debitAccount;
  }

  get creditAccount(): AccountNumberVO {
    return this._creditAccount;
  }

  get amount(): number {
    return this._amount.getValue();
  }

  get date(): string {
    return this._date.toISOString();
  }
}
