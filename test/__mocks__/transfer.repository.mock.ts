import { Transfer } from "@domain/entities/transfer";
import { TransferRepository } from "@domain/ports/transfer.repository";


export class MockTransferRepository extends TransferRepository {
    findByDateRange = jest.fn<Promise<Transfer[]>, [Date, Date]>();
}