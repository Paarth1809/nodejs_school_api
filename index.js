const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Node.js School API is running!');
});


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'schooluser',
  password: 'kira10',
  database: 'schooldb'
});


// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

//Add School APT
app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  //Validation
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
   return res.status(400).json({ message: 'Invalid input' });
 }

  const sql = 'INSERT INTO schools (name, address, latitude,   longitude) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
  if (err) return res.status(500).json({ message: 'Database error' });
  res.status(201).json({ message: 'School added successfully', id: result.insertID });
 });
});

// List School API
app.get('/listSchools', (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLng = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
}

const sql = 'SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance FROM schools ORDER BY distance';

db.query(sql, [userLat, userLng, userLat], (err, result) => {
  if (err) return res.status(500).json({ message: 'Database error' });
  res.json(result);
 });
});

//Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});