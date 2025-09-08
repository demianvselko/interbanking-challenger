import { Result } from "context/shraed/result";

export class AmountVO {
  private constructor(private readonly value: number) { }
  private static readonly MAX = 1_000_000;

  static create(value: number): Result<AmountVO> {
    if (value <= 0) {
      return Result.fail('Amount must be greater than zero');
    }
    if (value > AmountVO.MAX) {
      return Result.fail(`Amount must not exceed ${AmountVO.MAX}`);
    }
    return Result.ok(new AmountVO(value));
  }

  getValue(): number {
    return this.value;
  }
}