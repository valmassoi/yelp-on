import React from "react"
import { IndexLink, Link } from "react-router"

// import createHashHistory from 'history/lib/createHashHistory'

export default class PlaceCard extends React.Component {
  constructor() {
    super()
    this.state = {
      name: "test",
      description: "some description loreum ispum",
      image: "https://s3-media3.fl.yelpcdn.com/bphoto/z4ptM-mcK2NrVEViETOjjg/ms.jpg"
    }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let { name, image, description } = this.state
    let imageStyle = {
      float: 'left', marginRight: '20px',
      width: '100px', height: '100px'
    }
    return(
        <div class="panel panel-default placecard">
        <div class="panel-heading">{name}</div>
        <div class="panel-body">
          <img src={image} style={imageStyle}/>
          <p style={{width: '300px'}}> {description} </p>
          <button class="btn btn-primary btn-sm">I'm in!</button>
        </div>
      </div>
    )
  }
}
