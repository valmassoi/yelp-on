import React from "react"
import { IndexLink, Link } from "react-router"
import $ from 'jquery'
//TODO move to flux

export default class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      location: ""
    }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  handleSearchInput(e) {
    let location = e.target.value
    this.setState({ location })
  }

  search(e) {
    e.preventDefault(e)
    console.log("search yelp", this.state.location);
    let url = `http://192.168.1.108:8081/api/GET/yelp/${this.state.location}`
    $.getJSON(url, (data) => {//TODO move to flux
      console.log(data);
    })
  }

  render(){

    return(
      <div>
        <h3>Enter your location:</h3>
        <form class="" role="search" onSubmit={this.search.bind(this)}>
          <div class="form-group" style={{float: 'left', minWidth: '270px'}}>
            <input class="form-control" placeholder="Newport Beach or Zipcode: 92658" type="text" onChange={this.handleSearchInput.bind(this)} />
          </div>
          <button type="submit" class="btn btn-default" style={{marginLeft: '7px', width: '100px'}}>Submit</button>
        </form>
      </div>
    )
  }
}
