import React from "react"
import { IndexLink, Link } from "react-router"

// import createHashHistory from 'history/lib/createHashHistory'

export default class PlaceCard extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
      rsvp: false
    }
  }

  going(id) {
    this.twitterAuth()
    let { count, rsvp } = this.state//TODO ONLY IF AUTH
    rsvp ? count-- : count++
    rsvp = !this.state.rsvp
    console.log(id);//SEND TO MONGO
    this.setState({ count, rsvp })
  }

  twitterAuth() {

  }

  render(){
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
        <div class="panel-body" style={{height:'150px'}}>
          <img src={data.image_url?data.image_url:imgPlaceholder} style={imgStyle}/>
          <p> {data.snippet_text} </p>
          <button class="btn btn-primary btn-sm" onClick={()=>this.going(data.id)}>I'm in!</button>
        </div>
      </div>
    )
  }
}
