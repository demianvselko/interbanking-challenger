import { Transfer } from "../domain/core/entities/transfer";

export abstract class TransferRepository {
    abstract findByDateRange(companyId: string, start: Date, end: Date): Promise<Transfer[]>;
}
