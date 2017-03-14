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

const Tweet = use('App/Model/Tweet')
const User = use('App/Model/User')

// VANILLA ROUTES
Route.get('/', function * (request, response){
  const isLoggedIn = yield request.auth.check()
  const user = yield request.auth.getUser()
  if(user){
    if(user.is_active == true){
      if(isLoggedIn){
        response.redirect('home')
        return
      }
    }
    else{
      yield request.auth.logout()
    }
  }
  response.redirect('/login')
})
Route.get('/register').render('register')
Route.get('/login').render('login')

// TWEET GROUP
Route.group('tweets', () => {
  Route.resource('tweet', 'TweetController')
  Route.get('getTweet/:id', 'TweetController.getTweet')
}).middleware('auth')

// USER GROUP
Route.group('users', () => {
  Route.resource('users', 'UserController').except('store', 'index').middleware('auth')
  Route.get('/profile/:id', 'UserController.profile')
  Route.post('users/store', 'UserController.store')
  Route.post('users/makeFollower', 'UserController.makeFollower')
  Route.get('/home', 'UserController.home').as('home').middleware('auth')

  Route.get('/search', 'UserController.search')

  Route.get('/account/:id', 'UserController.account').middleware('auth')
  Route.post('/account/:id', 'UserController.updateAccount').middleware('auth')

  Route.get('/deactivate', 'UserController.deactivate')
  Route.post('/deactivate', 'UserController.deactivate')
  Route.get('/return/', 'UserController.return')
  Route.get('/reactivate/', 'UserController.reactivate')

  Route.post('/login', 'UserController.login')
  Route.get('/logout', 'UserController.logout')

  Route.get('/follow/:userId/:follower', 'UserController.follow')
  Route.get('/unfollow/:userId/:follower', 'UserController.unfollow')
})
