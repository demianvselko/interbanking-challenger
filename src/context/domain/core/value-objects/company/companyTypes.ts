export class CompanyTypeVO {
    private readonly type: 'PYME' | 'CORPORATIVA';

    constructor(type: string) {
        if (type !== 'PYME' && type !== 'CORPORATIVA') {
            throw new Error('Invalid company type');
        }
        this.type = type;
    }

    getValue(): 'PYME' | 'CORPORATIVA' {
        return this.type;
    }
}
