const express = require('express');
let app = express(); //makes a new express application for the website
let path = require('path'); //makes it easier to find files
const port = 3000; //specifies the port to listen on
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

app.listen(port, () => console.log('My server is listening'));