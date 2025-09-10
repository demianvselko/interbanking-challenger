import { Result } from "@domain/shared/result";

export class CompanyTypeVO {
    private constructor(private readonly type: 'PYME' | 'CORPORATIVA') { }

    static create(type: string): Result<CompanyTypeVO> {
        if (type !== 'PYME' && type !== 'CORPORATIVA') {
            return Result.fail('Invalid company type');
        }
        return Result.ok(new CompanyTypeVO(type));
    }

    getValue(): 'PYME' | 'CORPORATIVA' {
        return this.type;
    }
}