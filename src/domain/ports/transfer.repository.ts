import { Transfer } from "@domain/entities/transfer";

export abstract class TransferRepository {
  abstract findByDateRange(start: Date, end: Date): Promise<Transfer[]>;
}
