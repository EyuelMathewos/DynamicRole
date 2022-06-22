import { Knex } from "knex";

//permissions
export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('permissions', (table) => {
        table.foreign('accessId').references('id').inTable('accesslist');
      })
    .alterTable('permissions', (table) => {
        table.foreign('roleId').references('id').inTable('roles');
    })
}


export async function down(knex: Knex): Promise<void> {
}

