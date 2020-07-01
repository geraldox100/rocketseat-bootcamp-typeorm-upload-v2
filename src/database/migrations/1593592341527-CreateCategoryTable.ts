import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateCategoryTable1593592341527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'categories',
            columns: [
                { name: 'id', type: 'uuid', isPrimary:true, generationStrategy:'uuid', default: 'desafio06.uuid_generate_v4()' },
                { name: 'title', type: 'varchar', isNullable:false, isUnique:true },
                { name: 'created_at', type: 'timestamp', default:'now()' },
                { name: 'updated_at', type: 'timestamp', default:'now()' }
            ]
        }));

        await queryRunner.addColumn('transactions',new TableColumn({
            name: 'category_id',
            type: 'uuid',
            isNullable:false
        }));

        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: 'fk_categories_transaction',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('transactions','fk_categories_transactions');
        await queryRunner.dropColumn('transactions','category_id');
        await queryRunner.dropTable('categories');
    }

}
