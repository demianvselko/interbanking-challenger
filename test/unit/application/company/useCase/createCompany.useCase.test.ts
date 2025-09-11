import { CreateCompanyUseCase } from "@application/company/useCases/createCompany.useCase";
import { Company } from "@domain/entities/company";
import { Result } from "@domain/shared/result";
import { CompanyNameVO } from "@domain/valueObjects/company/companyName";
import { CompanyTypeVO } from "@domain/valueObjects/company/companyTypes";
import { CuitVO } from "@domain/valueObjects/company/cuit";
import { AccountNumberVO } from "@domain/valueObjects/transfer/accountNumber";
import { MockCompanyRepository } from "../../../../__mocks__/company.respository.mock";


describe('CreateCompanyUseCase', () => {
  let repo: MockCompanyRepository;
  let useCase: CreateCompanyUseCase;

  beforeEach(() => {
    repo = new MockCompanyRepository();
    useCase = new CreateCompanyUseCase(repo);
    repo.save = jest.fn().mockResolvedValue(undefined);
  });

  it('should create a company successfully', async () => {
    const request = {
      cuit: '12345678901',
      name: 'Test Company',
      type: 'PYME',
      accounts: ['111-222', '333-444'],
    };

    jest
      .spyOn(CuitVO, 'create')
      .mockReturnValue(Result.ok({ getValue: () => request.cuit } as CuitVO));
    jest
      .spyOn(CompanyNameVO, 'create')
      .mockReturnValue(
        Result.ok({ getValue: () => request.name } as CompanyNameVO),
      );
    jest
      .spyOn(CompanyTypeVO, 'create')
      .mockReturnValue(
        Result.ok({ getValue: () => request.type } as CompanyTypeVO),
      );
    jest
      .spyOn(AccountNumberVO, 'create')
      .mockImplementation((acc) =>
        Result.ok({ getValue: () => acc } as AccountNumberVO),
      );

    const result = await useCase.execute(request);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(Company);
    }
    expect(repo.save).toHaveBeenCalled();
  });

  it('should fail if CuitVO is invalid', async () => {
    const request = {
      cuit: 'invalid',
      name: 'Test',
      type: 'PYME',
      accounts: [],
    };
    jest.spyOn(CuitVO, 'create').mockReturnValue(Result.fail('Invalid CUIT'));

    const result = await useCase.execute(request);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid CUIT');
    }
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should fail if CompanyNameVO is invalid', async () => {
    const request = {
      cuit: '12345678901',
      name: '',
      type: 'PYME',
      accounts: [],
    };
    jest
      .spyOn(CuitVO, 'create')
      .mockReturnValue(Result.ok({ getValue: () => request.cuit } as CuitVO));
    jest
      .spyOn(CompanyNameVO, 'create')
      .mockReturnValue(Result.fail('Invalid name'));

    const result = await useCase.execute(request);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid name');
    }
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should fail if CompanyTypeVO is invalid', async () => {
    const request = {
      cuit: '12345678901',
      name: 'Test',
      type: 'INVALID',
      accounts: [],
    };
    jest
      .spyOn(CuitVO, 'create')
      .mockReturnValue(Result.ok({ getValue: () => request.cuit } as CuitVO));
    jest
      .spyOn(CompanyNameVO, 'create')
      .mockReturnValue(
        Result.ok({ getValue: () => request.name } as CompanyNameVO),
      );
    jest
      .spyOn(CompanyTypeVO, 'create')
      .mockReturnValue(Result.fail('Invalid type'));

    const result = await useCase.execute(request);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid type');
    }
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should fail if any AccountNumberVO is invalid', async () => {
    const request = {
      cuit: '12345678901',
      name: 'Test',
      type: 'PYME',
      accounts: ['111-222'],
    };
    jest
      .spyOn(CuitVO, 'create')
      .mockReturnValue(Result.ok({ getValue: () => request.cuit } as CuitVO));
    jest
      .spyOn(CompanyNameVO, 'create')
      .mockReturnValue(
        Result.ok({ getValue: () => request.name } as CompanyNameVO),
      );
    jest
      .spyOn(CompanyTypeVO, 'create')
      .mockReturnValue(
        Result.ok({ getValue: () => request.type } as CompanyTypeVO),
      );
    jest
      .spyOn(AccountNumberVO, 'create')
      .mockReturnValue(Result.fail('Invalid account'));

    const result = await useCase.execute(request);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid account');
    }
    expect(repo.save).not.toHaveBeenCalled();
  });
});
