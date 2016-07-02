import React from 'react'
import _ from 'lodash'
import $ from 'jquery'

export default class PlaceCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: props.count,
      rsvp: props.rsvp,
      users: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      count: nextProps.count,
      rsvp: nextProps.rsvp,
    })
  }

  twitterAuth(location) {
    const url = '/api/GET/twitterauth'
    $.getJSON(url, (data) => {
      if (data.requestToken) {
        this.going(location, data.requestToken)
        localStorage.setItem('_yelpon_user', data.requestToken)
      }
      if (data.tokenUrl)
        window.location.href = data.tokenUrl
    })
  }


  going(location, user) {
    let { count, rsvp, users } = this.state
    if (rsvp === true)
      _.pullAll(users, user)
    else
      users.push(user)
    rsvp = !rsvp
    rsvp ? count++ : count--
    let increment = rsvp ? 1 : -1

    this.setState({ users, count, rsvp })
    const url = '/api/POST/rsvp'
    $.ajax({
      type: 'POST',
      url,
      data: { location, user, increment, count },
      // success: (result) => this.setState({ count, rsvp }),
      dataType: 'json',
    })
  }

  render() {
    let { count, rsvp } = this.state
    let { place } = this.props
    const imgPlaceholder = 'http://pictures.dealer.com/a/aamptsubarusoa/1874/e98ed5a1460fe077dc69afa261a00a5dx.jpg'
    let imgStyle = {
      float: 'left', marginRight: '20px',
      width: '100px', height: '100px',
    }
    let rsvpBtn = (rsvp) ? 'btn-danger' : 'btn-primary'
    return (
      <div class="panel panel-default placecard">
        <div class="panel-heading">
          {place.name} - {count} going
          <div style={{ float: 'right' }}>{place.rating}</div>
        </div>
        <div class="panel-body" style={{ minHeight: '150px' }}>
          <img
            alt="yelp place"
            src={place.image_url ? place.image_url : imgPlaceholder}
            style={imgStyle}
          />
          <p> {place.snippet_text} </p>
          <button class={`btn btn-sm ${rsvpBtn}`} onClick={() => this.twitterAuth(place.id)}>
            {(this.state.rsvp) ? "I'm out..." : "I'm in!"}
          </button>
        </div>
      </div>
    )
  }
}
