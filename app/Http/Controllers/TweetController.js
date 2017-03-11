'use strict'

const Tweet = use('App/Model/Tweet')
const User = use('App/Model/User')

class TweetController {

  * index(request, response) {
    //
  }

  * create(request, response) {
    //
  }

  * store(request, response) {
    const tweet = new Tweet()
    const user = yield request.auth.getUser()
    tweet.user_id = user.id
    tweet.content = request.input('newTweet')
    yield tweet.save()
    response.redirect('back')
  }

  * show(request, response) {
    //
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    const tweet = yield Tweet.find(request.param('id'))
    const userInputs = yield request.all()
    tweet.content = userInputs.content
    yield tweet.save()
    response.redirect('back')
  }

  * destroy(request, response) {
    //
  }

  * getTweet(request, response){
    const tweet = yield Tweet.find(request.param('id'))
    const author = yield User.find(tweet.attributes.user_id)
    const loggedInUser = yield request.auth.getUser()
    if(loggedInUser.id === author.id)
      tweet.attributes.author = true;
    tweet.attributes.username = author.username
    tweet.attributes.name = author.firstname + " " + author.lastname
    response.send(tweet.toJSON())
  }

}

module.exports = TweetController
