require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 5000 || process.env.PORT;

app.use(express.urlencoded ({extended: true}));
app.use(express.json());

// static files

app.use(express.static('public'));

// Templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// routes

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})

