'use strict'

const Schema = use('Schema')

class TweetsTableSchema extends Schema {

  up () {
    this.create('tweets', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').references('users.id').unsigned()
      table.string('content', 140).notNullable()
    })
  }

  down () {
    this.drop('tweets')
  }

}

module.exports = TweetsTableSchema
