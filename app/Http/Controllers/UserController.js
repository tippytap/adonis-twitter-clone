'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Follower = use('App/Model/Follower')
const Tweet = use('App/Model/Tweet')
const Database = use('Database')

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
    user.is_active = true

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

    user.firstname = userInputs.firstname
    user.lastname = userInputs.lastname
    user.description = userInputs.description

    yield user.save()

    yield request.withAll().andWith({ messages: ["Profile updated!"] }).flash()

    response.redirect("back")

  }

  * account(request, response){
    const user = yield User.find(request.param('id'))
    yield response.sendView('user/account', {'user': user.toJSON()})
  }

  * updateAccount(request, response){

    const user = request.auth.getUser()

    const userInputs = request.all()

    const validationEmail = yield Validator.validate(userInputs, User.updateEmailRules)
    const validationUsername = yield Validator.validate(userInputs, User.updateUsernameRules)


    if(user.email !== userInputs.email) {
      if (validationUsername.fails() || validationEmail.fails()) {
        let messages = []
        yield request.withAll().andWith({errors: messages}).flash()
        response.redirect('back')
      }
      user.username = userInputs.username
      user.email = userInputs.email
      yield request.withAll().andWith({ messages: ["Account details updated!"] }).flash()
    }

    response.redirect('back')
  }

  * deactivate(request, response){
    const user = request.auth.getUser()
  }

  /**
  * Grabs the currently logged in user and all their
  * */
  * home(request, response){
    let userId = yield request.auth.getUser()
    userId = userId.id
    const user = yield User.query().where('id', userId).withCount('followers').first()

    let tweetCount = yield Database.from('tweets').whereRaw('user_id = ?', [user.id])
    user.tweets_count = tweetCount.length

    const following = yield Follower.query().where('follower', user.id)
    user.following_count = following.length

    const allTweets = []
    let myTweets = yield user.tweets().fetch()
    for(let i in myTweets.value()){
      let tweet = myTweets.value()[i]
      let date = tweet.getDate()
      tweet.username = user.username
      tweet.dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      allTweets.push(tweet)
    }

    for(let i in following){
      let follower = following[i]
      let tweets = yield Tweet.query().where('user_id', follower.user_id).fetch()
      for(let j in tweets.value()){
        let tweet = tweets.value()[j]
        let user = yield User.find(tweet.user_id)
        let date = tweet.getDate()
        tweet.username = user.username
        tweet.dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
        allTweets.push(tweet)
      }
    }

    yield response.sendView('userIndex', { 'user': user.toJSON(), 'tweets': allTweets })
  }

  /**
   * User profile
   * */
  * profile(request, response){
    let userId = yield User.find(request.param('id'))
    const user = yield User.query().where('id', userId.id).withCount('followers').first()

    let tweetCount = yield Database.from('tweets').whereRaw('user_id = ?', [user.id])
    user.tweets_count = tweetCount.length

    const following = yield Follower.query().where('follower', user.id)
    user.following_count = following.length

    const loggedInUser = yield request.auth.getUser()
    let userFollowers = yield user.followers().fetch()
    for(let i in userFollowers.value()){
      let follower = userFollowers.value()[i]
      if(follower.id === loggedInUser.id)
        user.isFollowed = true;
      else
        user.isFollowed = false;
    }

    let tweets = yield user.tweets().fetch()
    if(tweets.value().length > 0){
      for(let j in tweets.value()){
        let tweet = tweets.value()[j]
        let date = tweet.getDate()
        tweet.username = user.username
        tweet.dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      }
    }
    else
      tweets = { message: "No tweets yet!" }

    yield response.sendView('user/profile', { 'user': user.toJSON(), 'tweets': tweets.toJSON() })
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

  * search(request, response){
    let searchTerm = "%${" + request.input('search') + "}%";
    let users = User.query().where('username', 'like', searchTerm)
    response.send(users)
  }


}

module.exports = UserController
