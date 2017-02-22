'use strict'

const Schema = use('Schema')

class FollowingTableSchema extends Schema {

  up () {
    this.create('following', (table) => {
      table.increments()
      table.integer('user_follower').references('users.id').unsigned()
      table.integer('user_followed').references('users.id').unsigned()
      table.boolean('is_following')
      table.timestamps()
    })
  }

  down () {
    this.drop('following')
  }

}

module.exports = FollowingTableSchema
