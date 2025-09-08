import { Transfer } from "../domain/core/entities/transfer";

export abstract class TransferRepository {
    abstract findByDateRange(start: Date, end: Date): Promise<Transfer[]>;
}
