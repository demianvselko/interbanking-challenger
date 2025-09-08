export class CompanyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CompanyError';
    }
}

export const CompanyErrors = {
    DUPLICATE_CUIT: new CompanyError('A company with this CUIT already exists'),
    INVALID_NAME: new CompanyError('Company name is invalid'),
    DUPLICATE_ACCOUNT: new CompanyError('Account already exists for this company'),
};
