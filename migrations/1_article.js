exports.up = function(knex, Promise) {
  return knex.schema.createTable('article', function(table) {
    table.integer('reference').index().unique().primary().notNullable(); // (though not incrementing)
    table.string('title');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('article');
};
