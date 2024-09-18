import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupBaseTables1726632084723 implements MigrationInterface {
    name = 'SetupBaseTables1726632084723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "magicLink" character varying(50) NOT NULL, "callbackUrl" character varying(100), "userId" uuid, CONSTRAINT "UQ_b706e30b250afc8a678421f06ee" UNIQUE ("magicLink"), CONSTRAINT "UQ_3c204a5bcf9867570e9e093ea2f" UNIQUE ("callbackUrl"), CONSTRAINT "REL_56668229b541edc1d0e291b4c3" UNIQUE ("userId"), CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "avKey" uuid NOT NULL, "firstName" character varying(31) NOT NULL, "lastName" character varying(31) DEFAULT 'resident', "username" character varying(63) NOT NULL, CONSTRAINT "UQ_5f09553ede2e73c85b2abc8182a" UNIQUE ("avKey"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_56668229b541edc1d0e291b4c3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_stores" ADD CONSTRAINT "FK_63e8380a29134975cd835c52549" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_stores" ADD CONSTRAINT "FK_aacfd082707f731d4d4c8805d03" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_stores" DROP CONSTRAINT "FK_aacfd082707f731d4d4c8805d03"`);
        await queryRunner.query(`ALTER TABLE "user_stores" DROP CONSTRAINT "FK_63e8380a29134975cd835c52549"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_56668229b541edc1d0e291b4c3b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "links"`);
    }

}
