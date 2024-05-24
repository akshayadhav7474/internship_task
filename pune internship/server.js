const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

let users = [];
let expenses = [];

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.redirect('/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/expenses.html');
    } else {
        res.send('Invalid username or password');
    }
});

app.post('/add-expense', (req, res) => {
    if (req.session.user) {
        const { category, amount, comments } = req.body;
        const expense = { category, amount, comments, createdAt: new Date(), updatedAt: new Date() };
        expenses.push(expense);
        res.redirect('/expenses.html');
    } else {
        res.send('Unauthorized');
    }
});

app.get('/expenses', (req, res) => {
    if (req.session.user) {
        res.json(expenses);
    } else {
        res.send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
