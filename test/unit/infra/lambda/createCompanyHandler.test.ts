import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { Result } from '@domain/shared/result';
import { responseLambda } from '../../../../infra/utils/lambdaResponse';
import { createCompanyHandler } from '../../../../infra/lambda/createCompanyLambda';

jest.mock('@application/company/useCases/createCompany.useCase');
jest.mock('@infrastructure/repositories/json/company.repository.impl');
jest.mock('@interface/http/utils/lambdaResponse');

describe('createCompanyHandler (unit)', () => {
    let mockExecute: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockExecute = jest.fn();
        (CreateCompanyUseCase as jest.Mock).mockImplementation(() => ({
            execute: mockExecute,
        }));

        (responseLambda as jest.Mock).mockImplementation((status, body) => ({
            statusCode: status,
            body: JSON.stringify(body),
        }));
    });

    it('should return 201 when company is created successfully', async () => {
        const company = { toPrimitives: () => ({ id: '123', name: 'TestCo' }) };
        mockExecute.mockResolvedValue(Result.ok(company));

        const event = {
            body: JSON.stringify({
                cuit: '12345678901',
                name: 'TestCo',
                type: 'PYME',
                accounts: [],
            }),
        };

        const response = await createCompanyHandler(event);

        expect(mockExecute).toHaveBeenCalledWith({
            cuit: '12345678901',
            name: 'TestCo',
            type: 'PYME',
            accounts: [],
        });
        expect(responseLambda).toHaveBeenCalledWith(201, { id: '123', name: 'TestCo' });
        expect(response.statusCode).toBe(201);
    });

    it('should return 400 when use case fails', async () => {
        mockExecute.mockResolvedValue(Result.fail('Invalid data'));

        const event = {
            body: JSON.stringify({
                cuit: 'invalid',
                name: 'X',
                type: 'PYME',
                accounts: [],
            }),
        };

        const response = await createCompanyHandler(event);

        expect(responseLambda).toHaveBeenCalledWith(400, { error: 'Invalid data' });
        expect(response.statusCode).toBe(400);
    });

    it('should return 500 when JSON parse fails', async () => {
        const event = { body: '{invalid json}' };

        const response = await createCompanyHandler(event);

        expect(responseLambda).toHaveBeenCalledWith(500, expect.objectContaining({ error: expect.any(String) }));
        expect(response.statusCode).toBe(500);
    });

    it('should return 500 when use case throws unexpected error', async () => {
        mockExecute.mockRejectedValue(new Error('Unexpected fail'));

        const event = {
            body: JSON.stringify({
                cuit: '12345678901',
                name: 'TestCo',
                type: 'PYME',
            }),
        };

        const response = await createCompanyHandler(event);

        expect(responseLambda).toHaveBeenCalledWith(500, { error: 'Unexpected fail' });
        expect(response.statusCode).toBe(500);
    });
});
