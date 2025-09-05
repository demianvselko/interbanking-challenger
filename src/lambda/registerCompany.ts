import { Empresa } from "@core/entities/empresa.entity";
import { CuitVO } from "@core/value-objects/cuit.vo";
import { EmpresaJsonRepositoryAdapter } from "@infrastructure/persistence/json/empresa.repository.json.adapter";


interface RegisterCompanyInput {
    cuit: string;
    razonSocial: string;
    tipo: 'PYME' | 'CORPORATIVA';
}

interface LambdaResponse {
    statusCode: number;
    body: string;
}

export const handler = async (
    event: RegisterCompanyInput
): Promise<LambdaResponse> => {
    try {
        if (!event.cuit || !event.razonSocial || !event.tipo) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        const repo = new EmpresaJsonRepositoryAdapter();
        const cuitVO = new CuitVO(event.cuit);

        const exists = await repo.existsByCUIT(cuitVO.getValue());
        if (exists) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: 'Company already exists' }),
            };
        }

        const company = new Empresa(
            cuitVO,
            event.razonSocial,
            new Date(),
            event.tipo,
        );

        await repo.save(company);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Company registered successfully',
                data: company.toPrimitives ? company.toPrimitives() : company,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: (err as Error).message }),
        };
    }
};
