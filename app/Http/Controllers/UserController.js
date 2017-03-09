'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Follower = use('App/Model/Follower')
const Tweet = use('App/Model/Tweet')

class UserController {

  * store(request, response) {

    // get all inputs
    const userInputs = request.all()

    // get the validation result, which is yielded from the Validator service provider
    // using the rules defined statically on the User class
    const validation = yield Validator.validate(userInputs, User.rules)

    // if our validation has failed, then redirect to the register screen and flash the
    // error messages. this is done by yielding to the request and calling redirect on the response obj
    if(validation.fails()){
      yield request.withAll().andWith({errors: validation.messages()}).flash()
      response.redirect('back')
    }

    // otherwise, nothing bad happened and we create a new user instance
    const user = new User()

    // set the user properties
    user.username = userInputs.username
    user.password = userInputs.password
    user.email = userInputs.email
    user.firstname = userInputs.firstname
    user.lastname = userInputs.lastname

    // save the new user to the database, but we have to make sure to yield it
    // because this is a generator function and it won't do anything otherwise
    yield user.save()

    // yield the request, including a success message to be flashed to the user
    yield request.withAll().andWith({messages: ["User created successfully"]}).flash()

    // redirect the user back to the login page so that they can login to the system
    response.redirect("/login")

  }

  /**
   * Updates a user record
   * */
  * update(request, response) {
    const user = yield User.find(request.param('id'))
    const userInputs = yield request.all()
    if(user.email !== userInputs.email){
      const validation = yield Validator.validate(userInputs, User.updateRules)
      if(validation.fails()){
        yield request.withAll().andWith({errors: validation.messages()}).flash()
        response.redirect('back')
      }
      user.email = userInputs.email
    }

    user.firstname = userInputs.firstname
    user.lastname = userInputs.lastname

    yield user.save()

    yield request.withAll().andWith({ messages: ["Profile updated!"] }).flash()

    response.redirect("back")

  }

  /**
  * Grabs the currently logged in user and all their
  * */
  * home(request, response){
    const user = yield request.auth.getUser()
    const following = yield Follower.query().where('follower', user.id)
    const allTweets = []
    let myTweets = yield user.tweets().fetch()
    for(let i in myTweets.value()){
      let tweet = myTweets.value()[i]
      tweet.username = user.username
      allTweets.push(tweet)
    }
    for(let i in following){
      let follower = following[i]
      let tweets = yield Tweet.query().where('user_id', follower.user_id)
      for(let j in tweets){
        let user = yield User.find(tweets[j].user_id)
        tweets[j].username = user.username
        allTweets.push(tweets[j])
      }
    }
    yield response.sendView('userIndex', { 'user': user.toJSON(), 'tweets': allTweets })
  }

  /**
   * User profile
   * */
  * profile(request, response){
    const user = yield User.find(request.param('id'))
    const loggedInUser = yield request.auth.getUser()
    let userFollowers = yield user.followers().fetch()
    for(let i in userFollowers.value()){
      let follower = userFollowers.value()[i]
      if(follower.id === loggedInUser.id)
        user.isFollowed = true;
      else
        user.isFollowed = false;
    }
    let tweets = yield Tweet.query().where('user_id', user.id)
    if(tweets.length > 0){
      for(let j in tweets){
        tweets[j].username = user.username
      }
    }
    else
      tweets = { message: "No tweets yet!" }

    yield response.sendView('user/profile', { 'user': user.toJSON(), 'tweets': tweets })
  }

  /**
   * Shows a given user profile
   * */
  * show(request, response) {

  }

  /**
   * After being shown, edit user account information
   * */
  * edit(request, response) {
    const user = yield request.auth.getUser()
    yield response.sendView('user/edit', { 'user': user.toJSON() })
  }


  * destroy(request, response) {
    //
  }

  /**
   * User login
   * */
  * login(request, response){

    const email = request.input('email')
    const password = request.input('password')

    try{
      yield request.auth.attempt(email, password)
      yield request.withAll().andWith({messages: ['Logged in!']}).flash()
    }
    catch(e){
      yield request.withAll().andWith({errors: [{message: 'Incorrect email and/or password.'}]}).flash()
      response.redirect('back')
      return
    }
    response.redirect('/')

  }

  * logout(request, response){
    yield request.auth.logout()
    response.redirect('/')
  }


}

module.exports = UserController
