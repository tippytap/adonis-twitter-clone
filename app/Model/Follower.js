'use strict'

const Lucid = use('Lucid')

class Follower extends Lucid {

  static boot () {
    super.boot()
  }

  followers(){
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Follower
