
import express from "express"
import bodyParser  from "body-parser";
import mysql from "mysql2"
import fetch from "node-fetch"
import cors from "cors"
const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'movie_favourite_db'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes
// Search Route - Fetch data from OMDB API and display
app.get('/search', async (req, res) => {
  const searchTerm = req.query.title;
  const apiKey = "71038c66";
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from OMDB API:', error);
    res.status(500).json({ error: 'Error fetching data from OMDB API' });
  }
});

// Favorites Route - Save favorite to MySQL
app.post('/favourites', (req, res) => {
  const { title, year, type } = req.body;

  const sql = 'INSERT INTO favorites (title, year, type) VALUES (?, ?, ?)';
  db.query(sql, [title, year, type], (err, result) => {
    if (err) {
      console.error('Error saving favorite:', err);
      res.status(500).json({ error: 'Error saving favorite' });
    } else {
      res.json({ message: 'Favorite saved successfully' });
    }
  });
});

// Favorites Route - Fetch all favorites from MySQL
app.get('/favourites', (req, res) => {
  const sql = 'SELECT * FROM favorites';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      res.status(500).json({ error: 'Error fetching favorites' });
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});