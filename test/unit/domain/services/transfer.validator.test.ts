import { Company } from "@domain/entities/company";
import { TransferValidator } from "@domain/services/transfer.validator";
import { AccountNumberVO } from "@domain/valueObjects/transfer";


describe('TransferValidator', () => {
  let company: Company;
  let debitAccount: AccountNumberVO;
  let creditAccount: AccountNumberVO;

  beforeEach(() => {
    company = {
      accounts: [{ getValue: () => '111-222' }, { getValue: () => '333-444' }],
    } as unknown as Company;

    debitAccount = { getValue: () => '111-222' } as unknown as AccountNumberVO;
    creditAccount = { getValue: () => '333-444' } as unknown as AccountNumberVO;
  });

  it('should pass when debit and credit accounts belong to company and are different', () => {
    expect(() =>
      TransferValidator.validate(company, debitAccount, creditAccount),
    ).not.toThrow();
  });

  it('should throw if debit account does not belong to company', () => {
    const invalidDebit = {
      getValue: () => '999-999',
    } as unknown as AccountNumberVO;
    expect(() =>
      TransferValidator.validate(company, invalidDebit, creditAccount),
    ).toThrow('Debit account does not belong to the company');
  });

  it('should throw if credit account does not belong to company', () => {
    const invalidCredit = {
      getValue: () => '888-888',
    } as unknown as AccountNumberVO;
    expect(() =>
      TransferValidator.validate(company, debitAccount, invalidCredit),
    ).toThrow('Credit account does not belong to the company');
  });

  it('should throw if debit and credit accounts are the same', () => {
    const sameAccount = {
      getValue: () => '111-222',
    } as unknown as AccountNumberVO;
    expect(() =>
      TransferValidator.validate(company, sameAccount, sameAccount),
    ).toThrow('Debit and credit accounts cannot be the same');
  });
});
