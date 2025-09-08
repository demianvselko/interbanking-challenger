export class CompanyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CompanyError';

    }
}

export class CompanyErrors {
    static readonly DUPLICATE_CUIT = new CompanyError(
        'A company with this CUIT already exists'
    );
    static readonly INVALID_NAME = new CompanyError(
        'Company name is invalid'
    );
}


