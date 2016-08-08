var dbName = 'testdb';

var dbConfig = {
  client: 'postgres',
  connection: {
    host: 'localhost',
    port: 8432,
    user: 'app',
    password: 'test',
    charset: 'utf8'
  }
};


// --- Preparations
dbConfig.connection.database = 'postgres';
var Knex  = require('knex');
var knex1 = Knex(dbConfig),
    knex2;

var Article;

console.log('---');
console.log('Preparations for test...');	
console.log('Ensuring database...');
knex1.select().from('pg_database').where('datname', dbName).limit(1)
.then(function(res) {
  if(res.length == 0) {
    return knex1.raw('CREATE DATABASE ' + dbName);
  }
})
.then(function() {
  knex1.destroy();

  console.log('Running migrations...');
  dbConfig.connection.database = dbName;
  knex2 = Knex(dbConfig);
  return knex2.migrate.latest({ directory: './migrations' });
})
.then(function() {
  console.log('Emptying table...');
  return knex2.raw('TRUNCATE TABLE article');
})
.then(function() {
  console.log('Preparations completed, test starts now.');
  console.log('---');
  // Preparations ---

  var bookshelf = require('bookshelf')(knex2);

  Article = bookshelf.Model.extend({
    tableName:   'article',
    idAttribute: 'reference'
  });


  // 1st time, insert
  console.log('Inserting Article with reference "1" for the 1st time...');
  return new Article()
  .save({
    reference: 1,
    title:     'Title, 1st'
  });
})
.then(function() {
  return new Article().fetchAll();
})
.then(function(articles) {
  console.log('Article with reference "1" has been added for the 1st time: ');
  console.log(articles.toJSON());

  console.log('Adding Article with reference "1" for the 2nd time...');
  return new Article()
  .save({
    reference: 1,
    title:     'Title, 2nd'
  });
})
.then(function() {
   return new Article().fetchAll();
})
.then(function(articles) {
  console.log('Article with reference "1" has been added for the 2nd time: ');
  console.log(articles.toJSON());


  console.log('Test passed.');




  // clean-up
  return knex2.destroy();
});
