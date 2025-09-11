import { CreateCompanyHttpRequest } from '@interface/http/dto/createCompany.http.dto';
import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { Result } from '@domain/shared/result';
import { responseLambda } from '../utils/lambdaResponse';


export async function createCompanyHandler(
    event: { body: string },
): Promise<{ statusCode: number; body: string }> {
    try {
        const bodyData: CreateCompanyHttpRequest = JSON.parse(event.body);

        const companyRepo = new CompanyRepositoryImpl();
        const useCase = new CreateCompanyUseCase(companyRepo);

        const result: Result<any> = await useCase.execute({
            cuit: bodyData.cuit,
            name: bodyData.name,
            type: bodyData.type,
            accounts: bodyData.accounts ?? [],
        });

        if (!result.ok) {
            return responseLambda(400, { error: result.error });
        }

        return responseLambda(201, result.value.toPrimitives());
    } catch (err: unknown) {
        return responseLambda(500, {
            error: err instanceof Error ? err.message : 'Unknown error',
        });
    }
}
