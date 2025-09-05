import { IsString, IsEnum, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateEmpresaDto {
    @IsString()
    @Matches(/^\d{2}-?\d{8}-?\d{1}$/, { message: 'CUIT inválido (formato esperado: 20-12345678-1 o 20123456781)' })
    cuit: string;

    @IsString()
    razonSocial: string;

    @IsOptional()
    @IsDateString()
    fechaAdhesion?: string;

    @IsEnum(['PYME', 'CORPORATIVA'])
    tipo: 'PYME' | 'CORPORATIVA';
}
