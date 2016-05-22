import React from "react"

export default class Footer extends React.Component {

  render(){
    let footer = {
      margin: '50px auto',
      textAlign: 'center'
    }
    return(
      <div style={footer}>
        <a href="https://github.com/valmassoi/yelp-on" target="_blank"><i class="fa fa-github" aria-hidden="true"></i> github repo</a> by <a style={{marginTop:'10px'}} href="https://twitter.com/valmassoi" target="_blank">@valmassoi</a>
        <p style={{color:'grey', fontSize:'10px', marginTop:'10px'}}> data from <a href="https://yelp.com" target="_blank">yelp</a> </p>
      </div>
    )
  }
}
