import { Result } from "@domain/shared/result";

export class AdhesionDateVO {
    private constructor(private readonly value: Date) { }

    static create(value: Date): Result<AdhesionDateVO> {
        const now = new Date();
        if (value > now) {
            return Result.fail('Adhesion date cannot be in the future');
        }
        return Result.ok(new AdhesionDateVO(value));
    }

    getValue(): Date {
        return this.value;
    }

    toISOString(): string {
        return this.value.toISOString();
    }
}