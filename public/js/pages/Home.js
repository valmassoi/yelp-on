import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import PlaceCard from '../components/PlaceCard'
import Search from '../components/Search'
import YelpStore from '../stores/YelpStore'

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      places: [ ]
    }
  }

  componentWillMount() {
    YelpStore.on("change", this.yelp.bind(this))
  }

  componentWillUnmount() {
    YelpStore.removeAllListeners("change")
  }

  yelp() {
    let places = YelpStore.getPlaces()
    this.setState({ places })
  }

  render() {

    return(
      <div>
        <Search />
        <div class="container-fluid" style={{marginTop: '20px'}}>
          <div class="row">
          {this.state.places.map( (place, i) => {
               return (
                <div class="col-sm-12 col-md-6" key={"placecard-div-"+i}>
                  <PlaceCard data={place} />
                </div>
               )
             })}
          </div>
        </div>
      </div>
    )
  }
}
