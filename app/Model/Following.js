'use strict'

const Lucid = use('Lucid')

class Following extends Lucid {

  static boot () {
    super.boot()
  }

  followers(){
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Following
