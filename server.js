'use strict'

const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const Yelp = require('yelp')
const twitterAPI = require('node-twitter-api');
const env = require('dotenv')
const util = require('util')
const ObjectId = require('mongodb').ObjectID

const app = express()

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27018/data'

app.use(cors())
env.load()

const yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
})

function searchYelp(term, location, callback) {
  yelp.search({ term, location })
  .then(data => {
    callback(data)
  })
  .catch(err => {
    callback(err)
  })
}

function changeGoing(user, location) {//TODO
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let users = db.collection('users')
   users.insert(user, (err, data) => {
      if (err) throw err
      let id=JSON.stringify(user._id)
      callback(id)
      db.close()
    })
  })
}

const twitter = new twitterAPI({
	consumerKey: process.env.OAUTH_CONSUMER_KEY,
	consumerSecret: process.env.OAUTH_CONSUMER_SECRET,
	callback: 'http://192.168.1.108:8080/',
  x_auth_access_type: 'read'
})

function twitterAuth(callback) {
  twitter.getRequestToken((err, requestToken, requestTokenSecret, results) => {
    if (err) {
      console.log("Error: ", util.inspect(err, false, null));
    } else {
      console.log(requestToken, requestTokenSecret, results);
      callback(requestToken, requestTokenSecret)
    }
  })
}

app.get('/api/GET/yelp/:term/:location', (req, res) => {
  res.writeHead(200, { 'Content-Type':  'application/json' })
  searchYelp(req.params.term, req.params.location, (data) => {
    res.end(JSON.stringify(data))
  })
})

app.get('/api/GET/twitterauth', (req, res) => {
  res.writeHead(200, { 'Content-Type':  'application/json' })
  twitterAuth((requestToken, requestTokenSecret) => {
    let tokenUrl = twitter.getAuthUrl(requestToken)
    console.log(tokenUrl);
    res.end(JSON.stringify({ tokenUrl }))
  })
})

const port = process.env.PORT || 8081
http.createServer(app).listen(port)
console.log('Server Running on port: ' + port)
