import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ideas', (table) => {
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.index(['deleted_at'], 'idx_ideas_deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ideas', (table) => {
    table.dropIndex(['deleted_at'], 'idx_ideas_deleted_at');
    table.dropColumn('deleted_at');
  });
}
