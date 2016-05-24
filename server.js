'use strict'
//TODO MODULARIZE
const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const bodyParser = require('body-parser')
const Yelp = require('yelp')
const twitterAPI = require('node-twitter-api');
const env = require('dotenv')
const util = require('util')
const ObjectId = require('mongodb').ObjectID
const session = require('express-session')

const app = express()
app.use(session({
  requestToken: '',
  requestTokenSecret: '',
  secret: 'somesupersecretstuff',
  resave: false,//TODO CHECK IF NEEDS TO BE TRUE
  saveUninitialized: true
}))

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27018/data'

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('trust proxy')
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

function changeGoing(location, userToken, increment, count, callback) {
console.log(location, userToken, increment, count);

  mongo.connect(dbUrl, (err, db) => {
    if (err) throw err
    let places = db.collection('places')
    places.update(
      {'id': location},
      {
        $set: { count },
        $setOnInsert: {
          id: location
        },
      },
      {
        $cond: {
          if: (increment==1),
          then: {$push: { users: userToken }},
          else: {$pull: { users: userToken }}
        }
      },
      {'upsert':true},
      (err, data) => {
        if (err) throw err
        callback()
        db.close()
      }
    )
  })
}

function getGoers(callback) {
  mongo.connect(dbUrl, (err, db) => {
    if (err) throw err
    let places = db.collection('places')
    places.find().toArray((err, all) => {
      if (err) throw err
      callback(all)
      db.close()
    })
  })
}

const twitter = new twitterAPI({
	consumerKey: process.env.OAUTH_CONSUMER_KEY,
	consumerSecret: process.env.OAUTH_CONSUMER_SECRET,
	callback: 'http://192.168.1.108:8081/api/auth/',
  x_auth_access_type: 'read'
})

function twitterAuth(callback) {
  twitter.getRequestToken((err, requestToken, requestTokenSecret, results) => {
    if (err) {
      console.log("Error: ", util.inspect(err, false, null))
    } else {
      callback(requestToken, requestTokenSecret)
    }
  })
}

function twitterAccess(oauth_verifier, callback) {
  twitter.getAccessToken(session.requestToken, session.requestTokenSecret, oauth_verifier, (err, accessToken, accessTokenSecret, results) => {
  	if (err) {
  		console.log("Error: ", util.inspect(err, false, null))
  	} else {
      console.log("ACCESS!", accessToken, accessTokenSecret)

      let user = {
        accessToken,
        accessTokenSecret,
        locations: [ ]
      }

      mongo.connect(dbUrl, (err, db) => {
       if (err) throw err
       let users = db.collection('users')
       users.insert(user, (err, data) => {//TODO IF DOESNT EXIST?
          if (err) throw err
          console.log("added to mongo: ", user);
          callback(user)
          db.close()
        })
      })
  		//Step 4: Verify Credentials belongs here
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
  let requestToken = session.requestToken
  if(requestToken){
    console.log("already auth, dont send to login", requestToken)
    res.end(JSON.stringify({ requestToken }))
  }
  else{
    twitterAuth((requestToken, requestTokenSecret) => {
      let tokenUrl = twitter.getAuthUrl(requestToken)
      session.requestToken = requestToken
      session.requestTokenSecret = requestTokenSecret
      res.end(JSON.stringify({ tokenUrl }))
    })
  }
})

app.get('/api/auth/', (req, res) => {
  // res.setHeader('Content-Type', 'application/json');
  console.log('sesh', session.requestTokenSecret, session.requestTokenSecret)
  console.log(req.query.oauth_token)
  twitterAccess(req.query.oauth_verifier, (data) => {
    // res.send(JSON.stringify({ data }))
    res.redirect('http://192.168.1.108:8080/')
  })
})

app.post('/api/POST/rsvp', (req, res) => {
  let { location, user, increment, count } = req.body
  changeGoing(location, user, increment, count, () => {
    console.log("done");
  })
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end('{"success" : "POST success", "status" : 200}');
})

app.get('/api/GET/goers', (req, res) => {
  getGoers( data => {
    res.writeHead(200, { "Content-Type": "application/json" });
    let json = JSON.stringify(data)
    res.end(json)
  })
})

const port = process.env.PORT || 8081
http.createServer(app).listen(port)
console.log('Server Running on port: ' + port)
