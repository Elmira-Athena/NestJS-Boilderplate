import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetails } from './order-detail.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  user_id: number;

  @Column('varchar')
  customer_name: string;

  @Column('varchar')
  customer_phone: string;

  @Column('varchar')
  status: string;

  @Column('double precision')
  tax: number;

  @Column('double precision')
  total: number;

  @Column('varchar')
  currency: string;

  @Column('varchar')
  payment_order_id: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  order_details: OrderDetails[];

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}
