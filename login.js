const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { runInNewContext, runInThisContext } = require('vm');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'accounts_data'
});

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(req, res) {
    const username = req.body.username;
    const passwore = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!!');
        res.end();
    }
});

app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page');
    }
    res.end();
})

app.listen(3000);