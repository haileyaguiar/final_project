const express = require('express');
const session = require('express-session');
require('dotenv').config();
let knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME || 'petsdb.cgrlbkhl90jg.us-east-1.rds.amazonaws.com' ,
        user: process.env.RDS_USERNAME || 'postgres' ,
        password: process.env.RDS_PASSWORD || 'NT0t4cIV7eHQP4iTEY3R' ,
        database: process.env.RDS_DB_NAME || 'ebdb',
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectedUnauthorized: false} : false
    }
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


knex.raw('SELECT 1')
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection failed', err));


const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Home page
app.get('/home', (req, res) => {
    res.render('home');
});

// Database page
app.get('/database', (req, res) => {
    knex.select().from("findingpetsdb").then(findingpetsdb => {
    res.render('database', {fulldata: findingpetsdb});
    });
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
    try {
        const user = await knex('usertable') // Replace with your actual user table name
            .where({
                username: req.body.username, // Ensure these match your form and database
                password: req.body.password
            })
            .first();

        if (user) {
            res.redirect('/post'); // Redirect to post page if credentials are correct
        } else {
            res.render('login', { error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during the login process.');
    }
});

// Post page
app.get('/post', (req, res) => {
    res.render('post');
});


app.post('/newpost', async (req, res) => {

    var maxOwnerID = await knex('findingpetsdb').max('OwnerID').first();
    var OwnerID = maxOwnerID.max + 1;

    var maxPetID = await knex('findingpetsdb').max('PetID').first();
    var PetID = maxPetID.max + 1;

    console.log(req.body)
    // Insert new post, ensure your form fields match these keys
    await knex('findingpetsdb').insert({
        PetName: req.body.PetName,
        ImagePath: req.body.photo,
        PetReward: req.body.PetReward,
        LastSeenZip: req.body.LastSeenZip,
        LastSeenDate: req.body.LastSeenDate,
        LastSeenDesc: req.body.LastSeenDesc,
        OwnerFirstName: req.body.OwnerFirstName,
        OwnerLastName: req.body.OwnerLastName,
        OwnerPhone: req.body.OwnerPhone,
        OwnerEmail: req.body.OwnerEmail,
        OwnerZip: req.body.OwnerZip,
        OwnerID: OwnerID,
        PetID: PetID
        
        
        //the pet ID and the owner ID need to be figured out  

      });
    res.send('Post created successfully!');
});


// PetofDay page
app.get('/petofday', async (req, res) => {
    try {
        // const rows = await knex('pets').select('*').orderByRaw('RANDOM()').limit(1); // Adjust for your table
        const petOfTheDay = 0;
        res.render('petofday', { pet: petOfTheDay });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the pet of the day');
    }
});


// Signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/createaccount', async (req, res) => {
     await knex('usertable').insert({
         username: req.body.username,
         password: req.body.password
     });
    res.send('Account created successfully!');
});

app.listen(port, () => console.log(`My server is listening on port ${port}`));
