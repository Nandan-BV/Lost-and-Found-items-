import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('image_url');
    table.boolean('is_lost').notNullable().defaultTo(true); // true for lost, false for found
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true); // Adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('items');
}
