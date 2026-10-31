import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from '@database/typeorm/entities/payment-method.entity';
import { DataSource, Repository } from 'typeorm';
import { PaymentFactory } from './factories/payment.factory';
import { Product } from '@database/typeorm/entities/product.entity';
import { Order } from '@database/typeorm/entities/order.entity';
import { OrderDetails } from '@database/typeorm/entities/order-detail.entity';
import { ORDER_STATUS } from '@shared/enum/order-status.enum';

@Injectable()
export class OrderService {
  readonly tax: number;
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(PaymentFactory)
    private readonly paymentFactory: PaymentFactory,
    private datasource: DataSource,
  ) {
    this.tax = 8 / 100;
  }

  async create(createOrderDto: CreateOrderDto, userId: number) {
    await this.calculatePrice(createOrderDto);

    const paymentMethodName = await this.getPaymentMethodName(
      createOrderDto.payment_method_id,
    );

    let order: Order;

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      await queryRunner.manager.transaction(
        async (transactionalEntityManager) => {
          createOrderDto.items.map(async (item) => {
            const products = await transactionalEntityManager.find(Product, {
              where: {
                id: item.id,
              },
              lock: {
                mode: 'pessimistic_write',
              },
            });

            if (products.length === 0)
              throw new BadRequestException('CUS-0404');

            const createdOrder = queryRunner.manager.create(Order, {
              customer_name: createOrderDto.customer_name,
              customer_phone: createOrderDto.customer_phone,
              tax: this.tax,
              total: createOrderDto.total,
              user_id: userId,
              status: ORDER_STATUS.PENDING,
              currency: createOrderDto.currency,
              paymentMethod: { id: createOrderDto.payment_method_id },
            });

            order = await queryRunner.manager.save(Order, createdOrder);

            await queryRunner.manager.save(OrderDetails, {
              order: { id: order.id },
              product: { id: item.id },
              price: item.price,
              amount: item.amount,
            });
          });
        },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }

    return this.paymentFactory.createPaymentMethod(
      paymentMethodName,
      createOrderDto,
      order.id,
    );
  }

  async getPaymentMethodName(id: number) {
    const paymentMethodName = await this.paymentMethodRepository
      .createQueryBuilder('payment_methods')
      .select(['payment_methods.name as name'])
      .where('payment_methods.id = :id', { id: id })
      .getRawOne();

    if (!paymentMethodName) throw new BadRequestException('PAY-0001');

    return paymentMethodName.name;
  }

  async getPaymentMethodNameByPaymentOrderId(paymentOrderID: string) {
    const paymentMethodName = await this.orderRepository
      .createQueryBuilder('orders')
      .innerJoinAndSelect('orders.paymentMethod', 'paymentMethod')
      .select(['paymentMethod.name as name'])
      .where('orders.payment_order_id = :payment_order_id', {
        payment_order_id: paymentOrderID,
      })
      .getRawOne();
    if (!paymentMethodName) throw new BadRequestException('PAY-0001');

    return paymentMethodName.name;
  }

  async getOrderIDByPaymentOrderID(paymentOrderID: string) {
    const orderID = await this.orderRepository
      .createQueryBuilder('orders')
      .select(['orders.id as id'])
      .where('orders.payment_order_id = :payment_order_id', {
        payment_order_id: paymentOrderID,
      })
      .getRawOne();

    return orderID.id;
  }

  async calculatePrice(body: CreateOrderDto) {
    let totalPrice = 0;

    body.items.map((item) => {
      totalPrice += item.amount * item.price;
    });

    if (totalPrice + totalPrice * this.tax != body.total) {
      throw new BadRequestException('Total price is incorrect');
    }
  }
}
