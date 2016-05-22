import React from "react"

export default class Footer extends React.Component {

  render(){
    let footer = {
      margin: '50px auto',
      textAlign: 'center'
    }
    return(
      <div style={footer}>
        <a href="https://github.com/valmassoi/yelp-on" target="_blank"><i class="fa fa-github" aria-hidden="true"></i> github repo</a>
      </div>
    )
  }
}
