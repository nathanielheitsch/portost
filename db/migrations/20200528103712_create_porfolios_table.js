exports.up = function(knex) {
  return knex.schema.createTable('portfolios', t => {
    t.uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));
    t.dateTime('created_at').nullable();
    t.dateTime('updated_at').nullable();
    t.dateTime('deleted_at').nullable();

    t.string('title').notNull();
    t.text('description').nullable();

    t.uuid('author_id')
      .unsigned()
      .notNullable();
    t.boolean('public').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('portfolios');
};
