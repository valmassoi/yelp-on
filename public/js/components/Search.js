import React from 'react'
import $ from 'jquery'
import * as YelpAction from '../actions/YelpAction'

export default class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      term: 'bars',
      location: '',
    }
  }

  componentWillMount() {
    // YelpAction.getGoers()
    let term = localStorage.getItem('_yelpon_term'),
      location = localStorage.getItem('_yelpon_location')
    if (location) {
      YelpAction.getPlaces(term, location)
      this.setState({ term, location })
    }
  }

  componentDidMount() {
    let { term, location } = this.state
    $('#term').val(term)
    $('#location').val(location)
  }

  handleTerm() {
    const term = $('#term').val()
    localStorage.setItem('_yelpon_term', term)
    this.setState({ term })
  }

  handleSearchInput(e) {
    const location = e.target.value
    this.setState({ location })
  }

  search(e) {
    e.preventDefault(e)
    let { term, location } = this.state
    localStorage.setItem('_yelpon_location', location)
    YelpAction.getPlaces(term, location)
    YelpAction.getGoers()
  }

  render() {
    return (
      <div>
        <h3>Enter your location:</h3>
        <form class="" role="search" onSubmit={this.search.bind(this)}>
          <div class="form-group" style={{ float: 'left', minWidth: '270px' }}>
            <input id="location" class="form-control" placeholder="Newport Beach or Zipcode: 92658" type="text" onChange={this.handleSearchInput.bind(this)} />
          </div>
          <select id="term" class="form-control" style={{ float: 'left', marginLeft: '7px', width: '130px' }} onChange={() => this.handleTerm()}>
            <option value="bars">Bars</option>
            <option value="food">Restaurants</option>
          </select>
          <button type="submit" class="btn btn-default" style={{ marginLeft: '7px', width: '100px' }}>Submit</button>
        </form>
      </div>
    )
  }
}
