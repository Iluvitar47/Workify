const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM people';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// // Use routes
// const usersRoutes = require('./routes/users');

// app.use('/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});