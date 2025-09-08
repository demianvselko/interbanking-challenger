import { Result } from "context/shraed/result";


export class CompanyTypeVO {
    private constructor(private readonly value: CompanyType) { }

    static create(value: string): Result<CompanyTypeVO> {
        if (value !== 'PYME' && value !== 'CORPORATIVA') {
            return Result.fail('Company type must be PYME or CORPORATIVA');
        }
        return Result.ok(new CompanyTypeVO(value as CompanyType));
    }

    getValue(): CompanyType {
        return this.value;
    }
}
