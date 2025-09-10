
import { Company } from '@domain/entities/company';
import { CompanyRepository } from '@domain/ports/company.repository';
import { TransferRepository } from '@domain/ports/transfer.repository';
import { normalizeError } from '@domain/shared/error.utils';
import { Result } from '@domain/shared/result';
import { Injectable } from '@interface/shared/dependencyInjection/injectable';

@Injectable()
export class FindCompaniesWithTransfersUseCase {
  constructor(
    private companyRepo: CompanyRepository,
    private transferRepo: TransferRepository,
  ) { }

  async execute(lastMonth: boolean = true): Promise<Result<Company[]>> {
    try {
      const now = new Date();
      const start = lastMonth
        ? new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        : new Date(0);
      const end = now;

      const transfers = await this.transferRepo.findByDateRange(start, end);
      const companyIds = Array.from(
        new Set(transfers.map((transfer) => transfer.companyId)),
      );

      const companies = await this.companyRepo.findByIds(companyIds);
      return Result.ok(companies);
    } catch (err: unknown) {
      return Result.fail(normalizeError(err, 'Failed to fetch'));
    }
  }
}
