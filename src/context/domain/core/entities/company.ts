import { v4 as uuid4 } from 'uuid';
import { CuitVO } from '../value-objects/company/cuit';
import { CompanyNameVO } from '../value-objects/company/companyName';
import { AdhesionDateVO } from '../value-objects/company/adhesionDate';
import { AccountNumberVO } from '../value-objects/transfer/accountNumber';

export class Company {
  private readonly _id: string;
  private readonly _cuit: CuitVO;
  private readonly _name: CompanyNameVO;
  private readonly _dateOfAddition: AdhesionDateVO;
  private readonly _type: 'PYME' | 'CORPORATIVA';
  private readonly _accounts: AccountNumberVO[];

  private constructor(
    id: string,
    cuit: CuitVO,
    name: CompanyNameVO,
    dateOfAddition: AdhesionDateVO,
    type: 'PYME' | 'CORPORATIVA',
    accounts: AccountNumberVO[]
  ) {
    this._id = id;
    this._cuit = cuit;
    this._name = name;
    this._dateOfAddition = dateOfAddition;
    this._type = type;
    this._accounts = accounts;
  }

  get id(): string { return this._id; }
  get cuit(): CuitVO { return this._cuit; }
  get name(): CompanyNameVO { return this._name; }
  get dateOfAddition(): AdhesionDateVO { return this._dateOfAddition; }
  get type(): 'PYME' | 'CORPORATIVA' { return this._type; }
  get accounts(): AccountNumberVO[] { return this._accounts; }

  static create(
    cuit: CuitVO,
    name: CompanyNameVO,
    type: 'PYME' | 'CORPORATIVA',
    accounts: AccountNumberVO[] = []
  ): Company {
    return new Company(
      uuid4(),
      cuit,
      name,
      new AdhesionDateVO(new Date()),
      type,
      accounts
    );
  }

  addAccount(account: AccountNumberVO) {
    if (this._accounts.some(acc => acc.getValue() === account.getValue())) {
      throw new Error('Account already exists for this company');
    }
    this._accounts.push(account);
  }

  toPrimitives() {
    return {
      id: this._id,
      cuit: this._cuit.getValue(),
      name: this._name.getValue(),
      dateOfAddition: this._dateOfAddition.toISOString(),
      type: this._type,
      accounts: this._accounts.map(acc => acc.getValue())
    };
  }
}
