'use strict'

/*
|--------------------------------------------------------------------------
| Database Seeder
|--------------------------------------------------------------------------
| Database Seeder can be used to seed dummy data to your application
| database. Here you can make use of Factories to create records.
|
| make use of Ace to generate a new seed
|   ./ace make:seed [name]
|
*/

const Factory = use('Factory')

const User = use('App/Model/User')
const Tweet = use('App/Model/Tweet')

class DatabaseSeeder {

  * run () {
    const users = yield Factory.model(User).create(5)

    users.each(function * (user){
      const tweet = Factory.model(Tweet).make()
      yield user.tweets().save(tweet)
    })
  }


}

module.exports = DatabaseSeeder
