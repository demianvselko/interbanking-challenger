import { Company } from "@domain/entities/company";
import { AccountNumberVO } from "@domain/valueObjects/transfer/accountNumber";


export class TransferValidator {
  static validate(
    company: Company,
    debit: AccountNumberVO,
    credit: AccountNumberVO,
  ) {
    if (!company.accounts.some((acc) => acc.getValue() === debit.getValue())) {
      throw new Error('Debit account does not belong to the company');
    }

    if (!company.accounts.some((acc) => acc.getValue() === credit.getValue())) {
      throw new Error('Credit account does not belong to the company');
    }

    if (debit.getValue() === credit.getValue()) {
      throw new Error('Debit and credit accounts cannot be the same');
    }
  }
}
