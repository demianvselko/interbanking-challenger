import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateCompanyHttpRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  cuit!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['PYME', 'CORPORATIVA'])
  type!: 'PYME' | 'CORPORATIVA';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accounts?: string[];
}
