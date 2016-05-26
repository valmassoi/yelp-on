import React from "react"
import { IndexLink, Link } from "react-router"
import _ from 'lodash'
import YelpStore from '../stores/YelpStore'
import $ from 'jquery'//TODO MOVE TO ACTION

export default class PlaceCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: props.count,
      rsvp: props.rsvp,
      users: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("new props");
    this.setState({
      count: nextProps.count,
      rsvp: nextProps.rsvp
    });
  }

  twitterAuth(location) {//if twitter location in storage- skip
    let url = 'http://192.168.1.108:8081/api/GET/twitterauth'//TODO change url
    $.getJSON(url, (data) => {//TODO MOVE TO ACTOIN, send location too?
      if(data.requestToken) {
        this.going(location, data.requestToken)
        localStorage.setItem('_yelpon_user', data.requestToken)
      }
      if(data.tokenUrl)
        window.location.href = data.tokenUrl
    })
  }


  going(location, user) {
    let { count, rsvp, users } = this.state
    if(rsvp==true)
      _.pullAll(users, user)
    else
      users.push(user)
    rsvp = !rsvp
    rsvp ? count++ : count--
    // rsvp = !this.state.rsvp
    let increment = rsvp?1:-1
    console.log(users, increment)
    console.log(rsvp);
    this.setState({ users, count, rsvp  })
    const url = 'http://192.168.1.108:8081/api/POST/rsvp'
    $.ajax({
      type: "POST",
      url,
      data: { location, user, increment, count },
      // success: (result) => this.setState({ count, rsvp }),
      dataType: "json"
    })
  }

  render() {
    console.log("rerender");
    // this.getCount()

    let { count, rsvp } = this.state
    let { place } = this.props
    let imgPlaceholder = 'https://s3-media2.fl.yelpcdn.com/assets/srv0/seo_metaplace/e98ed5a1460f/assets/img/logos/yelp_og_image.png'
    let imgStyle = {
      float: 'left', marginRight: '20px',
      width: '100px', height: '100px'
    }
    let rsvpBtn = (rsvp)?'btn-danger':'btn-primary'
    return(
        <div class="panel panel-default placecard">
        <div class="panel-heading">
          {place.name} - {count} going
          <div style={{float:'right'}}>{place.rating}</div>
        </div>
        <div class="panel-body" style={{minHeight:'150px'}}>
          <img src={place.image_url?place.image_url:imgPlaceholder} style={imgStyle}/>
          <p> {place.snippet_text} </p>
          <button class={"btn btn-sm "+rsvpBtn} onClick={()=>this.twitterAuth(place.id)}>{(this.state.rsvp)?"I'm out...":"I'm in!"}</button>
        </div>
      </div>
    )
  }
}
