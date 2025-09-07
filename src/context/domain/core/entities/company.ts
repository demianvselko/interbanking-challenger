import { CuitVO } from 'context/domain/core/value-objects/company/cuit';
import { CompanyNameVO } from 'context/domain/core/value-objects/company/companyName';
import { AdhesionDateVO } from 'context/domain/core/value-objects/company/adhesionDate';
import { v4 as uuid4 } from 'uuid';

export class Company {
  private readonly _id: string;
  private readonly _cuit: CuitVO;
  private readonly _name: CompanyNameVO;
  private readonly _dateOfAddition: AdhesionDateVO;
  private readonly _type: 'PYME' | 'CORPORATIVA';

  private constructor(
    id: string,
    cuit: CuitVO,
    name: CompanyNameVO,
    dateOfAddition: AdhesionDateVO,
    type: 'PYME' | 'CORPORATIVA'
  ) {
    this._id = id;
    this._cuit = cuit;
    this._name = name;
    this._dateOfAddition = dateOfAddition;
    this._type = type;
  }

  static create(
    cuit: CuitVO,
    name: CompanyNameVO,
    type: 'PYME' | 'CORPORATIVA'
  ): Company {
    const now = new Date();
    return new Company(uuid4(), cuit, name, new AdhesionDateVO(now), type);
  }

  toPrimitives() {
    return {
      id: this._id,
      cuit: this._cuit.getValue(),
      name: this._name.getValue(),
      dateOfAddition: this._dateOfAddition.toISOString(),
      type: this._type,
    };
  }

  get id(): string {
    return this._id;
  }

  get cuit(): CuitVO {
    return this._cuit;
  }

  get name(): CompanyNameVO {
    return this._name;
  }

  get dateOfAddition(): AdhesionDateVO {
    return this._dateOfAddition;
  }

  get type(): 'PYME' | 'CORPORATIVA' {
    return this._type;
  }

}
