export class CuitVO {
  private readonly value: string;

  constructor(cuit: string) {
    const normalized = cuit.replace(/-/g, '').trim();

    if (!/^\d{11}$/.test(normalized)) {
      throw new Error('CUIT inválido');
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CuitVO): boolean {
    return this.value === other.value;
  }
}
