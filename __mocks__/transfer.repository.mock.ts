import { Transfer } from "@context/domain/core/entities/transfer";
import { TransferRepository } from "@context/ports/transfer.repository";

export class MockTransferRepository extends TransferRepository {
    findByDateRange = jest.fn<Promise<Transfer[]>, [Date, Date]>();
}