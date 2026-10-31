import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1720428107841 implements MigrationInterface {
    name = 'CreateOrdersTable1720428107841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL PRIMARY KEY,
                "user_id" integer,
                "customer_name" varchar,
                "customer_phone" varchar,
                "payment_method_id" integer,
                "payment_order_id" varchar,
                "status" varchar,
                "tax" double precision,
                "total" double precision,
                "currency" varchar,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods" ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS orders;
        `);
    }

}
