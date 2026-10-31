import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMediaTable1699973814239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS media (
            id SERIAL NOT NULL, 
            public_id varchar(255), 
            url varchar(255), 
            PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS media');
  }
}
