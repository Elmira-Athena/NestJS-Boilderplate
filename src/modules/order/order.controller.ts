import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { PaymentFactory } from './factories/payment.factory';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentFactory: PaymentFactory,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['orders'],
    operationId: 'orders',
    summary: 'Create orders',
    description: 'Create a new orders',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiBearerAuth('token')
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return await this.orderService.create(createOrderDto, req.user['userId']);
  }

  @Post('payments/:paymentOrderID/capture')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['orders'],
    operationId: 'orders',
    summary: 'Capture orders',
    description: 'Capture a orders',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiBearerAuth('token')
  async captureOrder(@Param('paymentOrderID') paymentOrderID: string) {
    const paymentMethodName =
      await this.orderService.getPaymentMethodNameByPaymentOrderId(
        paymentOrderID,
      );
    const orderID = await this.orderService.getOrderIDByPaymentOrderID(
      paymentOrderID,
    );

    return await this.paymentFactory.createCaptureOrder(
      paymentMethodName,
      orderID,
      paymentOrderID,
    );
  }
}
