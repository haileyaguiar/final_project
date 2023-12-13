const express = require('express');
const session = require('express-session');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME || 'eventual enpoint',
        user: process.env.RDS_USERNAME || 'postgres',
        password: process.env.RDS_PASSWORD || '30Baseballs',
        database: process.env.RDS_DB_NAME || 'findingpets',
        port: process.env.RDS_PORT || 5432
    }
});

const app = express();
const path = require('path');
const port = process.env.PORT || 8080;

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
        res.render('report', {fulldata: findingpetsdb});
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
        const user = await knex('users') // Replace with your actual user table name
            .where({
                Username: req.body.username, // Ensure these match your form and database
                Password: req.body.password
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
    // Insert new post, ensure your form fields match these keys
    await knex('your_post_table_name').insert({
        PetName: req.body.PetName,
        Image: req.body.photo,
        PetAge: req.body.PetAge,
        PetReward: req.body.PetReward,
        LastSeenZip: req.body.LastSeenZip,
        LastSeenDate: req.body.LastSeenDate,
        LastSeenDesc: req.body.LastSeenDesc//the pet ID and the owner ID, ownerfirstname, ownerphone need to be figured out  
      });
    res.send('Post created successfully!');
});


// PetofDay page
app.get('/petofday', async (req, res) => {
    try {
        const rows = await knex('pets').select('*').orderByRaw('RANDOM()').limit(1); // Adjust for your table
        const petOfTheDay = rows[0];
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
    await knex('userstorage').insert({
        Username: req.body.username,
        Password: req.body.password
    });
    res.send('Account created successfully!');
});

app.listen(port, () => console.log(`My server is listening on port ${port}`));
