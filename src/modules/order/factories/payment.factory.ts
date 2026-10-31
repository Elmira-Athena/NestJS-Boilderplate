import { Injectable, Scope } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CodService } from './cod.service';
import { MomoService } from './momo.service';
import { PaymentMethod } from '@shared/enum/payment-method.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentFactory {
  constructor(
    private readonly momoService: MomoService,
    private readonly codService: CodService,
  ) {}

  createPaymentMethod(method: string, order: CreateOrderDto, orderID: number) {
    switch (method) {
      case `${PaymentMethod.MOMO}`:
        return this.momoService.processingPayment(order, orderID);
      case `${PaymentMethod.COD}`:
        return this.codService.processingPayment(order, orderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  createCaptureOrder(method: string, orderID: number, paymentOrderID: string) {
    switch (method) {
      case `${PaymentMethod.MOMO}`:
        return this.momoService.captureOrder(orderID, paymentOrderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  cancelOrder(method: string, orderID: number, paymentOrderID: string) {
    switch (method) {
      case `${PaymentMethod.MOMO}`:
        return this.momoService.cancelOrder(orderID, paymentOrderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }
}
