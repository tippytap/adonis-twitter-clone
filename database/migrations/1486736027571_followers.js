'use strict'

const Schema = use('Schema')

class FollowersTableSchema extends Schema {

  up () {
    this.create('followers', (table) => {
      table.increments()
      table.integer('user_id').references('users.id').unsigned()
      table.integer('follower').references('users.id').unsigned()
      table.boolean('is_following')
      table.timestamps()
    })
  }

  down () {
    this.drop('followers')
  }

}

module.exports = FollowersTableSchema
