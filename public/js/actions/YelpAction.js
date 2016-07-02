import dispatcher from '../dispatcher'
import $ from 'jquery'
const local = ''

export function getPlaces(term, location) {
  const url = `${local}/api/GET/yelp/${term}/${location}`
  $.getJSON(url, (data) => {
    if (data.businesses)
      dispatcher.dispatch({ type: 'GOT_PLACES', places: data.businesses })
  })
}

export function getGoers() {
  const url = `${local}/api/GET/goers`
  $.getJSON(url, (data) => {
    if (data)
      dispatcher.dispatch({ type: 'GOT_GOERS', goers: data })
  })
}
