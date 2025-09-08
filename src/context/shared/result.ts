export type Result<T> = Success<T> | Failure;

export class Success<T> {
    readonly ok: true = true;
    constructor(public readonly value: T) { }
}

export class Failure {
    readonly ok: false = false;
    constructor(public readonly error: string | Error) { }
}

export const Result = {
    ok: <T>(value: T): Result<T> => new Success(value),
    fail: (error: string | Error): Result<never> => new Failure(error),
};
