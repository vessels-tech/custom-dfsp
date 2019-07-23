

exports.up = async function(knex, Promise) {

  const exists = await knex.schema.hasTable('credential');
  if (exists) {
    return Promise.resolve(true)
  }

  return knex.schema.createTable('credential', (t) => {
    t.increments().primary().notNullable();
    t.string('type').defaultTo('TWILIO').notNullable()
    t.integer('account_id').notNullable();
    t.string('twilio_account_sid').notNullable();
    t.string('twilio_access_token').notNullable();
    t.string('friendly_name').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    t.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));

    t.foreign('account_id').references('id').inTable('account')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('credential')
};
