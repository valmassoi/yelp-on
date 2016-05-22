'use strict'

const path = require('path')
const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID

const app = express()

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27018/data'

app.use(express.static(__dirname+'/public/'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('trust proxy')

function fetchPolls(callback) {
  mongo.connect(dbUrl, (err, db) => {
    if (err) throw err
    let polls = db.collection('polls')
    let data = polls.find().toArray((err, all) => {
      if (err) throw err
      callback(all)
      db.close()
    })
  })
}

function postPolls(title, username, options, callback) {
  let poll = {
    date: Date.now(),
    users:{
      creator: username,
      usernames: [ ],
      ips: [ ]
    },
    data:{
      title: title,
      options: options,
      results: options.map( () => 0 )
    }
  }
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let polls = db.collection('polls')
   polls.insert(poll, (err, data) => {
      if (err) throw err
      let id=JSON.stringify(poll._id)
      callback(id)
      db.close()
    })
  })
}

function votePoll(id, vote, user, ip) {
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let polls = db.collection('polls')
   polls.update(
     { "_id": ObjectId(id) },
     {
       $set: {
         "data.results": vote,
       },
       $push: {
         "users.usernames": user,
         "users.ips": ip
       }

    },
    function(err) {
      if (err) throw err
      db.close()
    })
 })
}

function deletePoll(id) {
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let polls = db.collection('polls')
   polls.remove( {"_id": ObjectId(id)});
   db.close()
 })
}

function addOption(options, results, id) {
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let polls = db.collection('polls')
   polls.update(
     { "_id": ObjectId(id) },
     {
       $set: {
         "data.options": options,
         "data.results": results
       }
    },
    function(err) {
      if (err) throw err
      db.close()
    })
 })
}

function addUser(email, password) {
  let username = email.split("@")[0]//+"theGreat" TODO check if user exists
  let user = {
    username,
    email,
    password
  }
  mongo.connect(dbUrl, (err, db) => {
   if (err) throw err
   let users = db.collection('users')
   users.insert(user, (err, data) => {
      if (err) throw err
      db.close()
    })
  })
}

function getUsers(callback) {
  mongo.connect(dbUrl, (err, db) => {
    if (err) throw err
    let users = db.collection('users')
    let data = users.find().toArray((err, all) => {
      if (err) throw err
      callback(all)
      db.close()
    })
  })
}

function getUserHash(email, callback) {
  mongo.connect(dbUrl, (err, db) => {
    if (err) throw err
    let users = db.collection('users')
    users.find(
      {
        'email': email
      }
    ).toArray((err, user) => {
      if (err) throw err
      if(user.length>0)
        callback(user[0].password)
      else
        callback("error: no user")
      db.close()
    })
  })
}

app.get('/api/polls', (req, res) => {
  fetchPolls( data => {
    res.writeHead(200, { "Content-Type": "application/json" });
    let json = JSON.stringify(data)
    res.end(json)
  })
})
app.post('/api/polls/POST', (req, res) => {
  postPolls(langFilter(req.body.title), req.body.creator || "guest", req.body.options, (id) => {
    res.end('{"success" : "POST success", "id" : '+id+', "status" : 200}');
  })
  res.writeHead(200, { 'Content-Type':  'application/json' })
})
app.post('/api/polls/VOTE', (req, res) => {
  votePoll(req.body.id, req.body.vote, req.body.user, req.ip)
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end('{"success" : "POST success", "status" : 200}');
})
app.get('/api/GET/IP', (req, res) => {
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end(JSON.stringify(req.ip));
})
app.post('/api/polls/DELETE', (req, res) => {
  deletePoll(req.body.id)
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end('{"success" : "POST success", "status" : 200}');
})
app.post('/api/polls/OPTION', (req, res) => {
  addOption(req.body.options, req.body.results, req.body.id)
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end('{"success" : "POST success", "status" : 200}');
})
app.post('/api/POST/USER', (req, res) => {
  addUser(req.body.email, req.body.hash)
  res.writeHead(200, { 'Content-Type':  'application/json' })
  res.end('{"success" : "POST success", "status" : 200}');
})
app.get('/api/GET/USERS', (req, res) => {
  getUsers( data => {
    res.writeHead(200, { "Content-Type": "application/json" });
    let json = JSON.stringify(data)
    res.end(json)
  })
})
app.get('/api/GET/USER/:email', (req, res) => {
  getUserHash(req.params.email, data => {
    res.writeHead(200, { "Content-Type": "application/json" });
    let json = JSON.stringify(data)
    res.end(json)
  })
})
app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('404!')
})

const port = process.env.PORT || 8081
http.createServer(app).listen(port)
console.log('Server Running on port: ' + port)
