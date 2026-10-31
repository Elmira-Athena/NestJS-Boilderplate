import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentMethodsTable1720428043300 implements MigrationInterface {
    name = 'CreatePaymentMethodsTable1720428043300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "payment_methods" (
                "id" SERIAL PRIMARY KEY,
                "name" varchar,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS payment_methods;
        `);
    }
}
