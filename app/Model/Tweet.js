'use strict'

const Lucid = use('Lucid')

class Tweet extends Lucid {

  static boot(){
    super.boot()
  }

  user(){
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Tweet
