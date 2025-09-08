import { v4 as uuid4 } from 'uuid';
import { CuitVO } from '../value-objects/company/cuit';
import { CompanyNameVO } from '../value-objects/company/companyName';
import { AdhesionDateVO } from '../value-objects/company/adhesionDate';
import { AccountNumberVO } from '../value-objects/transfer/accountNumber';
import { CompanyTypeVO } from '../value-objects/company/companyTypes';
import { Result } from 'context/shraed/result';
import { CompanyErrors } from 'context/domain/errors/company.errors';

export class Company {
  private constructor(
    private readonly _id: string,
    private readonly _cuit: CuitVO,
    private readonly _name: CompanyNameVO,
    private readonly _dateOfAddition: AdhesionDateVO,
    private readonly _type: CompanyTypeVO,
    private readonly _accounts: AccountNumberVO[]
  ) { }

  get id(): string { return this._id; }
  get cuit(): CuitVO { return this._cuit; }
  get name(): CompanyNameVO { return this._name; }
  get dateOfAddition(): AdhesionDateVO { return this._dateOfAddition; }
  get type(): CompanyTypeVO { return this._type; }
  get accounts(): AccountNumberVO[] { return this._accounts; }

  static create(
    cuit: CuitVO,
    name: CompanyNameVO,
    type: CompanyTypeVO,
    accounts: AccountNumberVO[] = []
  ): Result<Company> {
    const dateResult = AdhesionDateVO.create(new Date());
    if (!dateResult.ok) return Result.fail(dateResult.error);

    try {
      const company = new Company(
        uuid4(),
        cuit,
        name,
        dateResult.value,
        type,
        accounts
      );
      return Result.ok(company);
    } catch {
      return Result.fail(CompanyErrors.INVALID_NAME);
    }
  }

  addAccount(account: AccountNumberVO): Result<void> {
    if (this._accounts.some(acc => acc.getValue() === account.getValue())) {
      return Result.fail(CompanyErrors.DUPLICATE_ACCOUNT);
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
