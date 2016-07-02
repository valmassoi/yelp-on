import React from 'react'
import _ from 'lodash'
import PlaceCard from '../components/PlaceCard'
import Search from '../components/Search'
import YelpStore from '../stores/YelpStore'
import * as YelpAction from '../actions/YelpAction'

export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      places: [],
      ongoers: [],
    }
  }

  componentWillMount() {
    YelpStore.on('change', this.yelp.bind(this))
    YelpAction.getGoers()
  }

  componentWillUnmount() {
    YelpStore.removeAllListeners('change')
  }

  yelp() {
    let places = YelpStore.getPlaces(),
      ongoers = YelpStore.getGoers()
    this.setState({ places, ongoers })
  }

  getCount(place) {
    let { ongoers: goers } = this.state
    let count = 0
    goers.forEach((goer) => {
      if (goer.id === place.id)
        count = goer.count
    }
    )
    return count
  }
  getRSVP(place) {
    let ongoers = this.state.ongoers,
      user = localStorage.getItem('_yelpon_user'),
      value = false

    ongoers.forEach((goer) => {
      if (goer.id === place.id && _.includes(goer.users, user))
        value = true
    })
    return value
  }
  render() {
    return (
      <div>
        <Search />
        <div class="container-fluid" style={{ marginTop: '20px' }}>
          <div class="row">
          {this.state.places.map((place, i) => {
            let count = this.getCount(place)
            let rsvp = this.getRSVP(place)
            return (
              <div class="col-sm-12 col-md-6" key={`placecard-div-${i}`}>
                <PlaceCard place={place} count={count} rsvp={rsvp} />
              </div>
            )
          })}
          </div>
        </div>
      </div>
    )
  }
}
