import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('accesslist', (table) => {
        table.json('conditions').alter();
        table.json('fields');
      })
}


export async function down(knex: Knex): Promise<void> {
}

