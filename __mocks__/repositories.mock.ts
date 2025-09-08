import { Company } from "@context/domain/core/entities/company";
import { CompanyRepository } from "@context/ports/company.repository";

export const getCompanyRepoMock = () => {
    return {
        save: jest.fn<Promise<void>, [Company]>(),
    } as unknown as CompanyRepository;
};
