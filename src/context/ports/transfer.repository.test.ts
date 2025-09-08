import { Transfer } from "../domain/core/entities/transfer";
import { MockTransferRepository } from "../../../__mocks__/transfer.repository.mock";

describe("TransferRepository (abstract)", () => {
    let repo: MockTransferRepository;
    let transfer: Transfer;

    beforeEach(() => {
        repo = new MockTransferRepository();

        transfer = {
            id: "t1",
            idEmpresa: "12345678901",
            cuentaDebito: "123-456",
            cuentaCredito: "654-321",
            importe: { value: 1000 },
            fecha: new Date("2025-01-01")
        } as unknown as Transfer;
    });

    it("should call findByDateRange with start and end dates", async () => {
        const start = new Date("2025-01-01");
        const end = new Date("2025-01-31");

        await repo.findByDateRange(start, end);
        expect(repo.findByDateRange).toHaveBeenCalledWith(start, end);
    });

    it("should return an array of transfers when findByDateRange is called", async () => {
        repo.findByDateRange.mockResolvedValue([transfer]);

        const start = new Date("2025-01-01");
        const end = new Date("2025-01-31");

        const result = await repo.findByDateRange(start, end);
        expect(result).toEqual([transfer]);
        expect(repo.findByDateRange).toHaveBeenCalledTimes(1);
    });
});
