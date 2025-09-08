import { CompanyError } from "context/domain/errors/company.errors";
import { Result } from "context/shraed/result";
import { AdhesionDateVO } from "../value-objects/company/adhesionDate";
import { CompanyNameVO } from "../value-objects/company/companyName";
import { CompanyTypeVO } from "../value-objects/company/companyTypes";
import { CuitVO } from "../value-objects/company/cuit";
import { AccountNumberVO } from "../value-objects/transfer/accountNumber";
import { v4 as uuid4 } from 'uuid';

export class Company {
  private constructor(
    private readonly _id: string,
    private readonly _cuit: CuitVO,
    private readonly _name: CompanyNameVO,
    private readonly _dateOfAddition: AdhesionDateVO,
    private readonly _type: CompanyTypeVO,
    private readonly _accounts: AccountNumberVO[]
  ) { }

  get id() { return this._id; }
  get cuit() { return this._cuit; }
  get name() { return this._name; }
  get dateOfAddition() { return this._dateOfAddition; }
  get type() { return this._type; }
  get accounts() { return this._accounts; }

  static create(
    cuit: CuitVO,
    name: CompanyNameVO,
    type: CompanyTypeVO,
    accounts: AccountNumberVO[] = []
  ): Result<Company> {
    try {
      const company = new Company(
        uuid4(),
        cuit,
        name,
        new AdhesionDateVO(new Date()),
        type,
        accounts
      );
      return Result.ok(company);
    } catch (err) {
      return Result.fail(new CompanyError('Failed to create company'));
    }
  }

  addAccount(account: AccountNumberVO): Result<void> {
    if (this._accounts.some(acc => acc.getValue() === account.getValue())) {
      return Result.fail(new CompanyError('Duplicate account'));
    }
    this._accounts.push(account);
    return Result.ok(undefined);
  }

  toPrimitives() {
    return {
      id: this._id,
      cuit: this._cuit.getValue(),
      name: this._name.getValue(),
      dateOfAddition: this._dateOfAddition.toISOString(),
      type: this._type.getValue(),
      accounts: this._accounts.map(acc => acc.getValue()),
    };
  }
}
