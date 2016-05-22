import React from "react"
import { Link } from "react-router"
import _ from 'lodash'
import PlaceCard from "../components/PlaceCard"
import Search from "../components/Search"

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    return(
      <div>
        <Search />
        <div class="container-fluid" style={{marginTop: '20px'}}>
          <div class="row">
            <div class="col-sm-12 col-md-6"> <PlaceCard /> </div>
            <div class="col-sm-12 col-md-6"> <PlaceCard /> </div>
            <div class="col-sm-12 col-md-6"> <PlaceCard /> </div>
          </div>
        </div>
      </div>
    )
  }
}
