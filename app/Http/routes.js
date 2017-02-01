'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/').render('welcome')
Route.get('/signup').render('/signup')
Route.get('/login').render('login')
Route.get('/home').render('home')

Route.group('tweets', function(){
  Route.resource('tweet', 'TweetController')
})

Route.group('users', function(){
  Route.resource('users', 'UserController')
})



//Route.get('/delete/:id').render('/delete')

