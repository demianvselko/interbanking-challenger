import { Result } from '@context/shared/result';

export class CompanyNameVO {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<CompanyNameVO> {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
      return Result.fail('Company name must be between 2 and 100 characters');
    }
    return Result.ok(new CompanyNameVO(trimmed));
  }

  getValue(): string {
    return this.value;
  }
}
