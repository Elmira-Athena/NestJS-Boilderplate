import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1720427966818 implements MigrationInterface {
    name = 'CreateProductsTable1720427966818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL PRIMARY KEY,
                "name" varchar,
                "price" double precision,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    }

}
