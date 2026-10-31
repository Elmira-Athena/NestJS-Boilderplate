import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderDetailsTable1720428256707 implements MigrationInterface {
    name = 'CreateOrderDetailsTable1720428256707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "order_details" (
                "id" SERIAL PRIMARY KEY,
                "order_id" integer,
                "product_id" integer,
                "price" double precision,
                "amount" integer,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
                FOREIGN KEY ("product_id") REFERENCES "products" ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS order_details;`);
    }

}
