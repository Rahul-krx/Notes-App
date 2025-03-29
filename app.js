require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 5000 || process.env.PORT;

app.use(passport.initialize());
// app.use(passport.session());

app.use(express.urlencoded ({extended: true}));
app.use(express.json());

// Connect to MongoDB

connectDB();

// static files

app.use(express.static('public'));

// Templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// error handling middleware
app.get('*', function(req, res){
   res.status(404).render('404.ejs');
})


app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})

