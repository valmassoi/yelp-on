import dispatcher from '../dispatcher'
import $ from 'jquery'
const local = 'http://192.168.1.108:8081'//TODO CHANGE URL http://192.168.1.108:8081

export function getPlaces(term, location) {
  //TODO FETCHING
  let url = `${local}/api/GET/yelp/${term}/${location}`
  $.getJSON(url, (data) => {
    console.log(data.businesses);
    dispatcher.dispatch({type: "GOT_PLACES", places: data.businesses})
    console.log(data.businesses[0].name);
  })
}
