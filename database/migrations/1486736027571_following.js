'use strict'

const Schema = use('Schema')

class FollowingTableSchema extends Schema {

  up () {
    this.create('following', (table) => {
      table.timestamps()
      // table.integer('followed').primaryKey()
    })
  }

  down () {
    this.drop('following')
  }

}

module.exports = FollowingTableSchema
