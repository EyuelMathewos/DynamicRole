import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('accesslist', (table) => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('action').notNullable();
        table.string('subject').notNullable();
        table.string('conditions').notNullable();
      })

      .createTable('permissions', (table) => {
        table.increments('id');
        table.integer('accessId').unsigned().notNullable();
        table.integer('roleId').unsigned().notNullable();
      })  
  };
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable('users')
      .dropTable('articles')
      .dropTable('roles')
      .dropTable('accesstokens');
  };