import React from "react"
import { IndexLink, Link } from "react-router"
import $ from 'jquery'
import * as YelpAction from '../actions/YelpAction'

export default class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      term: "bars",
      location: ""
    }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  handleTerm(e) {
    let term = e.value
    this.setState({ term })
  }

  handleSearchInput(e) {
    let location = e.target.value
    this.setState({ location })
  }

  search(e) {
    e.preventDefault(e)
    let { term, location } = this.state
    YelpAction.getPlaces(term, location)
  }

  render(){

    return(
      <div>
        <h3>Enter your location:</h3>
        <form class="" role="search" onSubmit={this.search.bind(this)}>
          <div class="form-group" style={{float: 'left', minWidth: '270px'}}>
            <input class="form-control" placeholder="Newport Beach or Zipcode: 92658" type="text" onChange={this.handleSearchInput.bind(this)} />
          </div>
          <select class="form-control" style={{float: 'left', marginLeft: '7px', width: '130px'}} onChange={() => this.handleTerm(this)}>
            <option value="bars">Bars</option>
            <option value="food">Restaurants</option>
          </select>
          <button type="submit" class="btn btn-default" style={{marginLeft: '7px', width: '100px'}}>Submit</button>
        </form>
      </div>
    )
  }
}
