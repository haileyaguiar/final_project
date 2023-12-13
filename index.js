const express = require('express');
const session = require('express-session');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'bucket_list',
        port: 5432
    }
});

const app = express();
const path = require('path');
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your_secret_key', // replace with a real secret key
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
function ensureLoggedIn(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Home page
app.get('/home', (req, res) => {
    res.render('home');
});

// Database page
app.get('/database', async (req, res) => {
    try {
        const rows = await knex('your_table_name').select('*'); // Replace with your table name
        res.render('database', { pets: rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving all pets');
    }
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
        const user = await knex('users') // Replace 'users' with your actual user table name
            .where({
                Username: req.body.username, // Replace 'Username' with your actual username column name
                Password: req.body.password  // Replace 'Password' with your actual password column name
            })
            .first();

        if (user) {
            req.session.loggedIn = true; // Set session variable
            res.redirect('/post');
        } else {
            res.render('login', { error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during the login process.');
    }
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

// Post page - Protected
app.get('/post', ensureLoggedIn, (req, res) => {
    res.render('post');
});

app.post('/newpost', ensureLoggedIn, async (req, res) => {
    // Insert new post, ensure your form fields match these keys
    await knex('your_post_table_name').insert({
        // Your columns and values go here
    });
    res.send('Post created successfully!');
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
