import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // return knex.raw('CREATE DATABASE asd')
    return knex.schema
    //   .raw('CREATE DATABASE dynamicrole')
      .createTable('roles', (table) => {
        table.increments('id');
        table.string('name', 255).notNullable();
      })
  
      .createTable('users', (table) => {
        table.increments('id');
        table.string('email', 255).notNullable();
        table.string('password').notNullable();
        table.integer('roleId').unsigned().notNullable();
  
        table.foreign('roleId').references('id').inTable('roles').onDelete("CASCADE");
  
      })
      .createTable('accesstokens', (table) => {
        table.increments('id');
        table.integer('clientId').notNullable();
        table.integer('iat').notNullable();
        table.integer('exp').notNullable();
        table.foreign('clientId').references('id').inTable('users').onDelete("CASCADE");;
      })
      .createTable('articles', (table) => {
        table.increments('id');
        table.string('title', 255).notNullable();
        table.string('description').notNullable();
        table.integer('authorId').unsigned().notNullable();
  
        table.foreign('authorId').references('id').inTable('users');
      });
  
  };
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable('users')
      .dropTable('articles')
      .dropTable('roles')
      .dropTable('accesstokens');
  };