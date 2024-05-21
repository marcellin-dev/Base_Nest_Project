import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export interface ICurrentUser {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    description: null;
    createdAt: Date;
    updatedAt: Date;
  };
  isDelete: boolean;
  emailVerified: boolean;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class QueryProductPageable {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  size: number;

  @ApiPropertyOptional({ default: 150 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(100)
  @Max(500000)
  maxPrice: number;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(100)
  minPrice: number;

  @ApiPropertyOptional({ default: 'phone' })
  @IsOptional()
  // @Transform(({ value }) => String(value))
  search?: string;

  // @ApiPropertyOptional({ type: [String] })
  // @IsOptional()
  // @IsArray()
  // @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  // filter?: string[];
  //
  // @ApiPropertyOptional({ type: [String] })
  // @IsOptional()
  // @IsArray()
  // @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  // advFilter?: string[];
  //
  // include?: string[];
}

export class QueryPageable {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  size: number;

  @ApiPropertyOptional({ default: 'phone' })
  @IsOptional()
  // @Transform(({ value }) => String(value))
  search?: string;
}

export interface ITokenObject {
  token: string;
  duration: number;
}

export interface IPaiementCompleteStatus {
  payToken: string;
  statusPay: string;
  reason: string;
}

export interface IWitdrawCompleteStatus {
  reference: string;
  status: string;
  amount: number;
  receiver: string;
}
