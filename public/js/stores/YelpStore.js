import { EventEmitter } from 'events'
import $ from 'jquery'

import dispatcher from '../dispatcher'

class YelpStore extends EventEmitter {
  constructor() {
    super()
    this.places
    this.goers
  }

  getPlaces() {
    return this.places
  }

  getGoers() {
    return this.goers
  }

  handleActions(action) {
  console.log(action.type);
    switch(action.type) {
      case "GOT_PLACES": {
        this.places = action.places
        this.emit("change")
        break
      }
      case "GOT_GOERS": {
        this.goers = action.goers
        this.emit("goers_change")
        break
      }
    }
  }
}
const yelpStore = new YelpStore
dispatcher.register(yelpStore.handleActions.bind(yelpStore))
// window.yelpStore = yelpStore//TODO for testing
// window.dispatcher = dispatcher//TODO for testing
export default yelpStore
