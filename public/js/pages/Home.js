import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import PlaceCard from '../components/PlaceCard'
import Search from '../components/Search'
import YelpStore from '../stores/YelpStore'
import * as YelpAction from '../actions/YelpAction'

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      places: [ ],
      goers: [ ]
    }
  }

  componentWillMount() {
    YelpStore.on("change", this.yelp.bind(this))
    YelpStore.on("goers_change", this.goers.bind(this))
    YelpAction.getGoers()
  }

  componentWillUnmount() {
    YelpStore.removeAllListeners("change")
  }

  goers() {
    let goers = YelpStore.getGoers()
    this.setState({ goers })
  }

  yelp() {
    let places = YelpStore.getPlaces()
    this.setState({ places })
  }

  getCount(place) {
    console.log("new count");
    let newPlace = Object.assign({}, place)
    newPlace.count = 0
    newPlace.users = [ ]
    this.state.goers.forEach((goers) =>
      {
        if (_.includes(goers, place.id)){
          newPlace.count = goers.count
          newPlace.users = goers.users
        }
      }
    )
    return newPlace
  }

  render() {
    return(
      <div>
        <Search />
        <div class="container-fluid" style={{marginTop: '20px'}}>
          <div class="row">
          {this.state.places.map( (place, i) => {
              let newPlace = this.getCount(place)
               return (
                <div class="col-sm-12 col-md-6" key={"placecard-div-"+i}>
                  <PlaceCard data={newPlace} />
                </div>
               )
             })}
          </div>
        </div>
      </div>
    )
  }
}
