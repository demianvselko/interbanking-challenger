import { Result } from "@context/shared/result";

export class CuitVO {
  private constructor(private readonly value: string) { }

  static create(cuit: string): Result<CuitVO> {
    const normalized = cuit.replace(/-/g, '').trim();
    if (!/^\d{11}$/.test(normalized)) {
      return Result.fail('CUIT must have exactly 11 digits');
    }
    return Result.ok(new CuitVO(normalized));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CuitVO): boolean {
    return this.value === other.value;
  }
}