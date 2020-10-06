
const express = require('express');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

//créer une instance d'express
const app = express(),
    bodyParser = require("body-parser");
port = 3010;

app.use(bodyParser.json());
mongoose.Promise = global.Promise;

console.log('the process is : ', process.env.NODE_ENV );

// Connecting to the database
mongoose.connect(process.env.NODE_ENV === 'test' ? dbConfig.urltest : dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
   !process.env.NODE_ENV === 'test'  && console.log("Successfully connected to the database");
}).catch(err => {
   !process.env.NODE_ENV === 'test'  &&  console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


//app.use(express.static(process.cwd()+"/"));
app.use(express.static(`${__dirname}/`));



// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req,res) => {
    console.log('-------get pages-------');
    res.sendFile(express.static(`${__dirname}/`)+"index.html")
});

// Require Notes routes
require('./app/routes/post.routes.js')(app);

module.exports = app;
