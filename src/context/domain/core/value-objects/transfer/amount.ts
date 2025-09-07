export class AmountVO {
  private readonly value: number;
  private static readonly MAX = 1_000_000;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    if (value > AmountVO.MAX) {
      throw new Error(`Amount must not exceed ${AmountVO.MAX}`);
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
