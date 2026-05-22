import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ideas', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.enum('complexity', ['easy', 'medium', 'hard']).defaultTo('medium');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ideas');
}
