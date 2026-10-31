import { ApiProperty } from '@nestjs/swagger';
import { IsCurrencyValid } from '@shared/decorator/currency.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsCurrency,
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
  @IsNotEmpty({ message: 'ORDER-FIELD-0001' })
  @IsString()
  customer_name: string;

  @ApiProperty({
    type: String,
    example: '0123456789',
  })
  @IsNotEmpty({ message: 'ORDER-FIELD-0002' })
  @IsString()
  customer_phone: string;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  @IsNotEmpty({ message: 'ORDER-FIELD-0005' })
  @IsNumber()
  payment_method_id: number;

  @ApiProperty({
    type: Number,
    example: 1000000 * 0.08 + 1000000,
  })
  @IsNotEmpty({ message: 'ORDER-FIELD-0004' })
  @IsNumber()
  price: number;

  @ApiProperty({
    type: String,
    example: 'VND',
  })
  @IsCurrencyValid()
  @IsNotEmpty({ message: 'ORDER-FIELD-0003' })
  @IsString()
  currency: string;
}
