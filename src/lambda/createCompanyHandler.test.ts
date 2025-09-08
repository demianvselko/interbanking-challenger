import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/json/company.repository.impl';
import { Result } from '@context/shared/result';
import { CreateCompanyHttpRequest } from '@interface/http/dto/createCompany.http.dto';
import { createCompanyHandler } from './createCompanyLambda';

jest.mock('@application/company/useCases/createCompany.useCase');
jest.mock('@infrastructure/repositories/json/company.repository.impl');

describe('createCompanyHandler', () => {
  const MockedUseCase = CreateCompanyUseCase as jest.MockedClass<
    typeof CreateCompanyUseCase
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 when company is created successfully', async () => {
    const fakeCompany = {
      toPrimitives: () => ({
        id: '1',
        cuit: '12345678901',
        name: 'Test SA',
        type: 'PYME',
        accounts: ['12345678910'],
      }),
    };

    MockedUseCase.prototype.execute = jest
      .fn()
      .mockResolvedValue(Result.ok(fakeCompany));

    const event: CreateCompanyHttpRequest = {
      cuit: '12345678901',
      name: 'Test SA',
      type: 'PYME',
      accounts: ['12345678910'],
    };

    const response = await createCompanyHandler(event);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(fakeCompany.toPrimitives());
    expect(MockedUseCase.prototype.execute).toHaveBeenCalledWith(event);
  });

  it('should return 400 when use case fails validation', async () => {
    MockedUseCase.prototype.execute = jest
      .fn()
      .mockResolvedValue(Result.fail('Invalid CUIT'));

    const event: CreateCompanyHttpRequest = {
      cuit: 'invalid',
      name: 'Test SA',
      type: 'PYME',
    };

    const response = await createCompanyHandler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid CUIT' });
  });

  it('should return 500 when an unexpected error occurs', async () => {
    MockedUseCase.prototype.execute = jest.fn().mockImplementation(() => {
      throw new Error('Unexpected DB error');
    });

    const event: CreateCompanyHttpRequest = {
      cuit: '12345678901',
      name: 'Test SA',
      type: 'CORPORATIVA',
    };

    const response = await createCompanyHandler(event);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Unexpected DB error' });
  });
});
