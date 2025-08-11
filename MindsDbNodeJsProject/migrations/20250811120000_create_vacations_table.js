module.exports.up = async function (knex) {
  await knex.schema.createTable('vacations', (table) => {
    table.increments('id').primary();
    table.string('destination').notNullable();
    table.integer('duration').notNullable();
    table.float('cost').notNullable();
    table.timestamps(true, true);
  });
};

module.exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('vacations');
};