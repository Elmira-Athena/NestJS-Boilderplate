import { Injectable } from '@nestjs/common';
import { IPayment } from './payment.interface';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/create-order.dto';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@database/typeorm/entities/order.entity';
import { ORDER_STATUS } from '@shared/enum/order-status.enum';
import { PaymentMethod } from '@shared/enum/payment-method.enum';

@Injectable()
export class MomoService implements IPayment {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async processingPayment(order: CreateOrderDto, orderID: number) {
    const requestId =
      this.configService.get<string>('momo_gateway.mm_partner_code') +
      new Date().getTime();
    const signature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('momo_gateway.mm_secret_key'),
      )
      .update(await this.rawSignature(order.total, requestId))
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.configService.get<string>(
        'momo_gateway.mm_partner_code',
      ),
      accessKey: this.configService.get<string>('momo_gateway.mm_access_key'),
      requestId: requestId,
      amount: order.total,
      orderId: requestId,
      orderInfo: this.configService.get<string>('momo_gateway.mm_order_info'),
      redirectUrl: this.configService.get<string>(
        'momo_gateway.mm_redirect_url',
      ),
      ipnUrl: this.configService.get<string>('momo_gateway.mm_ipn_url'),
      extraData: '',
      requestType: this.configService.get<string>(
        'momo_gateway.mm_request_type',
      ),
      signature: signature,
      lang: 'en',
    });

    const hostname = this.configService.get('momo_gateway.mm_host_name');
    const port = this.configService.get('momo_gateway.mm_port');
    const url = `https://${hostname}:${port}/v2/gateway/api/create`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody).toString(),
      },
      body: requestBody,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      await this.updatePaymentOrderID(data.orderId, orderID);
      return {
        orderId: orderID,
        payment_method_name: PaymentMethod.MOMO,
        payment_order_id: data.orderId,
        status: ORDER_STATUS.PENDING,
        payment_url: data.payUrl,
      };
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async rawSignature(amount: number, requestId: string) {
    const accessKey = this.configService.get<string>(
      'momo_gateway.mm_access_key',
    );
    const extraData = '';
    const ipnUrl = this.configService.get<string>('momo_gateway.mm_ipn_url');
    const orderId = requestId;
    const orderInfo = this.configService.get<string>(
      'momo_gateway.mm_order_info',
    );
    const partnerCode = this.configService.get<string>(
      'momo_gateway.mm_partner_code',
    );
    const redirectUrl = this.configService.get<string>(
      'momo_gateway.mm_redirect_url',
    );
    const requestType = this.configService.get<string>(
      'momo_gateway.mm_request_type',
    );
    return (
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType
    );
  }

  async cancelOrder(orderID: number, paymentOrderID: string) {
    await this.updateStatusOrder(ORDER_STATUS.CANCELLED, orderID);

    return {
      payment_method_name: PaymentMethod.MOMO,
      order_id: orderID,
      payment_order_id: paymentOrderID,
    };
  }

  async captureOrder(orderID: number, orderPaymentID: string) {
    await this.updateStatusOrder(ORDER_STATUS.PAID, orderID);

    return {
      payment_method_name: 'Momo',
      status: ORDER_STATUS.PAID,
      order_id: orderID,
      payment_order_id: orderPaymentID,
    };
  }

  async updatePaymentOrderID(paymentOrderID: string, orderID: number) {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .update(Order)
      .set({ payment_order_id: paymentOrderID })
      .where('orders.id = :order_id', { order_id: orderID })
      .execute();
  }

  async updateStatusOrder(status: string, orderID: number) {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .update(Order)
      .set({ status: status })
      .where('orders.id = :order_id', { order_id: orderID })
      .execute();
  }
}
