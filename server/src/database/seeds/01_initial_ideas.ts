import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('ideas').del();

  // Inserts seed entries
  await knex('ideas').insert([
    {
      id: knex.raw('(UUID())'),
      title: 'Sistema de Gestión de Laboratorios',
      description: 'Una app para controlar stocks de reactivos y turnos de máquinas.',
      complexity: 'medium',
    },
    {
      id: knex.raw('(UUID())'),
      title: 'Bot de Trading con IA',
      description: 'Análisis de sentimiento en tiempo real para operar crypto.',
      complexity: 'hard',
    },
    {
      id: knex.raw('(UUID())'),
      title: 'Generador de Landing Pages',
      description: 'Herramienta No-Code para marketing rápido.',
      complexity: 'easy',
    },
  ]);
}
