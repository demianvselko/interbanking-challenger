import { Result } from "@domain/shared/result";

export class AccountNumberVO {
    private constructor(private readonly value: string) { }

    static create(value: string): Result<AccountNumberVO> {
        if (!/^[0-9]{10,20}$/.test(value)) {
            return Result.fail('Account number must be between 10 and 20 digits');
        }
        return Result.ok(new AccountNumberVO(value));
    }

    getValue(): string {
        return this.value;
    }
}