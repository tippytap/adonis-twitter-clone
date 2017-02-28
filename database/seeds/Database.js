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
const Following = use('App/Model/Follower')

class DatabaseSeeder {

  * run () {
    const users = yield Factory.model('App/Model/User').create(5)

    users.each(function * (user){
      for(let i = 0; i < 20; i++){
        const tweets = Factory.model('App/Model/Tweet').make()
        yield user.tweets().save(tweets)
      }
      for(let i = 0; i < 6; i++){
        const follower = Factory.model('App/Model/Follower').make()
        yield user.followers().save(follower)
      }
    })
  }

}

module.exports = DatabaseSeeder
