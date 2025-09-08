import { CreateCompanyHttpRequest } from 'interface/http/dto/createCompany.http.dto';
import { CreateCompanyUseCase } from 'application/company/useCases/createCompany.useCase';
import { CompanyRepositoryImpl } from 'infrastructure/repositories/json/company.repository.impl';
import { Result } from '@context/shared/result';

export async function createCompanyHandler(
    event: CreateCompanyHttpRequest
): Promise<{ statusCode: number; body: any }> {
    const companyRepo = new CompanyRepositoryImpl();
    const useCase = new CreateCompanyUseCase(companyRepo);

    let statusCode = 201;
    let body;

    try {
        const result: Result<any> = await useCase.execute({
            cuit: event.cuit,
            name: event.name,
            type: event.type,
            accounts: event.accounts ?? [],
        });

        if (!result.ok) {
            statusCode = 400;
            body = { error: result.error };
        } else {
            body = result.value.toPrimitives();
        }
    } catch (err: unknown) {
        statusCode = 500;
        body = { error: err instanceof Error ? err.message : 'Unknown error' };
    }

    return { statusCode, body };
}
