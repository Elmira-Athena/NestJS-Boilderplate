import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Item {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 200000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    example: 'Example customer name',
  })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({
    type: String,
    example: '0123456789',
  })
  @IsNotEmpty()
  @IsString()
  customer_phone: string;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  payment_method_id: number;

  @ApiProperty({
    type: Number,
    example: 1000000 * 0.08 + 1000000,
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({
    type: String,
    example: 'VND',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ type: [Item] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
