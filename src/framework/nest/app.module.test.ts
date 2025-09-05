import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@framework/nest/app.module';
import { EmpresaController } from '@application/controllers/empresas.controller';

describe('AppModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should have EmpresaController', () => {
        const controller = module.get<EmpresaController>(EmpresaController);
        expect(controller).toBeDefined();
    });
});
