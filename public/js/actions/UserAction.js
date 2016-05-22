import dispatcher from '../dispatcher'
import $ from 'jquery'
const local = ''//TODO CHANGE URL http://192.168.1.108:8081

export function getUsers() {
  const url = local+'/api/GET/USERS/'
  $.getJSON(url, (users) => {
    dispatcher.dispatch({type: "GOT_USERS", users})
  })
}
