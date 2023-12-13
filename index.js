const express = require('express');
let app = express(); //makes a new express application for the website
let path = require('path'); //makes it easier to find files
const port = process.env.PORT || 8080; //specifies the port to listen on
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true})) //this is how we're parsing and matching of data. 
app.set('views', path.join(__dirname, '/views'));


const knex = require('knex')({
    client: 'pg',
    connection: {
        host:'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'bucket_list',
        port: 5432
    }
})

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Database page
app.get('/database', (req, res) => {
    res.render('database');
});

// Info page
app.get('/info', (req, res) => {
    res.render('info');
});

// Landing page
app.get('/landing', (req, res) => {
    res.render('landing');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// PetofDay page
app.get('/petofday', (req, res) => {
    res.render('petofday');
});

// Post page
app.get('/post', (req, res) => {
    res.render('post');
});

// Signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});


app.listen(port, () => console.log('My server is listening'));