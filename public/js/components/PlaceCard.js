import React from "react"
import { IndexLink, Link } from "react-router"
import $ from 'jquery'//TODO MOVE TO ACTION

export default class PlaceCard extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
      rsvp: false
    }
  }

  twitterAuth(location) {//if twitter location in storage- skip
    let url = 'http://192.168.1.108:8081/api/GET/twitterauth'//TODO change url
    $.getJSON(url, (data) => {//TODO MOVE TO ACTOIN, send location too?
      if(data.requestToken)
        this.going(location, data.requestToken)
      if(data.tokenUrl)
        window.location.href = data.tokenUrl
    })
  }

  going(location, user) {
    let { count, rsvp } = this.state//TODO ONLY IF AUTH
    rsvp ? count-- : count++
    rsvp = !this.state.rsvp
    let increment = rsvp?1:-1
    console.log(location, user, increment, count);//SEND TO MONGO
    const url = 'http://192.168.1.108:8081/api/POST/rsvp'
    $.ajax({
      type: "POST",
      url,
      data: { location, user, increment, count },
      success: (result) => this.setState({ count, rsvp }),
      dataType: "json"
    })
  }

  render() {
    let { count: people } = this.state
    let { data } = this.props
    let imgPlaceholder = 'https://s3-media2.fl.yelpcdn.com/assets/srv0/seo_metadata/e98ed5a1460f/assets/img/logos/yelp_og_image.png'
    let imgStyle = {
      float: 'left', marginRight: '20px',
      width: '100px', height: '100px'
    }
    return(
        <div class="panel panel-default placecard">
        <div class="panel-heading">{data.name} - {people} going
          <div style={{float:'right'}}>{data.rating}</div>
        </div>
        <div class="panel-body" style={{minHeight:'150px'}}>
          <img src={data.image_url?data.image_url:imgPlaceholder} style={imgStyle}/>
          <p> {data.snippet_text} </p>
          <button class="btn btn-primary btn-sm" onClick={()=>this.twitterAuth(data.id)}>I'm in!</button>
        </div>
      </div>
    )
  }
}
