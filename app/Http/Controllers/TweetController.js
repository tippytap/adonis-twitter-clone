'use strict'

const Tweet = use('App/Model/Tweet')

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
    //
  }

  * destroy(request, response) {
    //
  }

}

module.exports = TweetController
