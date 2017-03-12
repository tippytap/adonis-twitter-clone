'use strict'

/*
|--------------------------------------------------------------------------
| Model and Database Factory
|--------------------------------------------------------------------------
|
| Factories let you define blueprints for your database models or tables.
| These blueprints can be used with seeds to create fake entries. Also
| factories are helpful when writing tests.
|
*/

const Factory = use('Factory')

/*
|--------------------------------------------------------------------------
| User Model Blueprint
|--------------------------------------------------------------------------
| Below is an example of blueprint for User Model. You can make use of
| this blueprint inside your seeds to generate dummy data.
|
*/
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username(),
    firstname: fake.first(),
    lastname: fake.last(),
    profile_img_path: '/assets/default-profile.png',
    email: fake.email(),
    password: fake.password()
  }
})

Factory.blueprint('App/Model/Tweet', (fake) => {
  return {
    content: fake.sentence()
  }
})

Factory.blueprint('App/Model/Follower', (fake) => {

  return{
    follower: fake.integer({min: 1, max: 6}),
    is_following: true
  }
})
