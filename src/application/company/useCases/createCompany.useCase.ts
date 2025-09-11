import { Injectable } from '@interface/shared/dependencyInjection/injectable';
import { CreateCompanyRequest } from '../dto/createCompany.dto';
import { Company } from '@domain/entities/company';
import { CompanyRepository } from '@domain/ports/company.repository';
import { Result } from '@domain/shared/result';
import { CuitVO, CompanyNameVO, CompanyTypeVO } from '@domain/valueObjects/company';
import { AccountNumberVO } from '@domain/valueObjects/transfer';

@Injectable()
export class CreateCompanyUseCase {
  constructor(private companyRepo: CompanyRepository) { }

  async execute(request: CreateCompanyRequest): Promise<Result<Company>> {
    const cuitResult = CuitVO.create(request.cuit);
    if (!cuitResult.ok) return Result.fail(cuitResult.error);

    const nameResult = CompanyNameVO.create(request.name);
    if (!nameResult.ok) return Result.fail(nameResult.error);

    const typeResult = CompanyTypeVO.create(request.type);
    if (!typeResult.ok) return Result.fail(typeResult.error);

    const accounts: AccountNumberVO[] = [];
    for (const acc of request.accounts || []) {
      const accResult = AccountNumberVO.create(acc);
      if (!accResult.ok) return Result.fail(accResult.error);
      accounts.push(accResult.value);
    }

    const companyResult = Company.create(
      cuitResult.value,
      nameResult.value,
      typeResult.value,
      accounts,
    );
    if (!companyResult.ok) return Result.fail(companyResult.error);

    const company = companyResult.value;

    await this.companyRepo.save(company);

    return Result.ok(company);
  }
}
