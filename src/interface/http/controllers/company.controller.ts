import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateCompanyUseCase } from '@application/company/useCases/createCompany.useCase';
import { FindCompaniesByAdhesionUseCase } from '@application/company/useCases/getCompaniesAdheredInLastMonth.useCase';
import { FindCompaniesWithTransfersUseCase } from '@application/company/useCases/getCompaniesWithTransfersInTheLastMonth.useCase';
import { CreateCompanyHttpRequest } from '../dto/createCompany.http.dto';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly findByAdhesionUseCase: FindCompaniesByAdhesionUseCase,
    private readonly findWithTransfersUseCase: FindCompaniesWithTransfersUseCase,
  ) {}

  @Post()
  async create(@Body() request: CreateCompanyHttpRequest): Promise<any> {
    const result = await this.createCompanyUseCase.execute(request);
    if (!result.ok) return { error: result.error };
    return result.value.toPrimitives();
  }

  @Get('adhesion')
  async adhesion(): Promise<any> {
    const result = await this.findByAdhesionUseCase.execute();
    if (!result.ok) return { error: result.error };
    return result.value.map((company) => company.toPrimitives());
  }

  @Get('transfers')
  async transfers(): Promise<any> {
    const result = await this.findWithTransfersUseCase.execute();
    if (!result.ok) return { error: result.error };
    return result.value.map((company) => company.toPrimitives());
  }
}
