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
app.get('/home', (req, res) => {
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
app.get('/', (req, res) => {
    res.render('landing');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const user = await knex('your_table_name') // Replace 'your_table_name' with your actual table name
        .where({
            Username: req.body.username, 
            Password: req.body.password,
        })
        .first();

    if (user) {
        // Set a cookie to indicate the user is logged in
        res.cookie('loggedIn', 'yes');

        res.redirect('/post');
    } else {
        // Display an error message on the login page
        res.render('login', { error: 'Your username and/or password are incorrect.' });
        // or
        // res.send('Your username and/or password are incorrect.');
    }

});


// PetofDay page
app.get('/petofday', (req, res) => {
    res.render('petofday');
});

// Post page
app.get('/post', (req, res) => {
    res.render('post');
});

app.post('/newpost', async (req, res) => {
await knex('').insert({ //add table name here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    PetName: PetName,
    Image:photo,
    PetAge:PetAge,
    PetReward:PetReward,
    LastSeenZip:LastSeenZip,
    LastSeenDate:LastSeenDate,
    LastSeenDesc:LastSeenDesc
    //the pet ID and the owner ID need to be figured out
})

res.send('Post created successfully!')
})
// Signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

  //create account
  app.post('/createaccount', async (req, res) => {
    // Insert data into the userstorage table
    await knex('userstorage').insert({ //add the table here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      Username: req.body.username,
      Password: req.body.password,
    });
    //send a response indicating success
    res.send('Account created successfully!');
  });

app.listen(port, () => console.log('My server is listening'));