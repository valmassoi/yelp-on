'use strict'

// const path = require('path')
const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const Yelp = require('yelp')
const env = require('dotenv')
// const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID

const app = express()

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27018/data'

// app.use(express.static(__dirname+'/public/'))
app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }))
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

app.get('/api/GET/yelp/:term/:location', (req, res) => {
  res.writeHead(200, { 'Content-Type':  'application/json' })
  searchYelp(req.params.term, req.params.location, (data) => {
    res.end(JSON.stringify(data))
  })
})

const port = process.env.PORT || 8081
http.createServer(app).listen(port)
console.log('Server Running on port: ' + port)
