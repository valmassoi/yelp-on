import { EventEmitter } from 'events'
import $ from 'jquery'

import dispatcher from '../dispatcher'

class UserStore extends EventEmitter {
  constructor() {
    super()
    this.user
  }

  getUser() {
    return this.user
  }

  handleActions(action) {
    console.log(action.type);
    switch(action.type) {
      case "GOT_USERS": {
        this.users = action.users
        this.emit("change")
        break
    }
  }

}

const userStore = new UserStore
dispatcher.register(userStore.handleActions.bind(userStore))
// window.userStore = userStore//TODO for testing
// window.dispatcher = dispatcher//TODO for testing
export default userStore
