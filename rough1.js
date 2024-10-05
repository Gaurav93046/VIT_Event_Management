const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express();
const port = 3000;
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'game_sales';
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
// Use middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static files in public directory
app.use(express.static('public'));
// Create Games collection and insert 10 documents
app.post('/createGames', (req, res) => {
 // Get form data from request body
 const { id, name, platform, release_year } = req.body;
 // Insert document into Games collection
 client.connect((err) => {
 assert.strictEqual(null, err);
 const db = client.db(dbName);
 const games = db.collection('games');
 games.insertOne({
 id: parseInt(id),
 name: name,
 platform: platform,
 release_year: parseInt(release_year)
 }, (err, result) => {
 assert.strictEqual(null, err);
 assert.strictEqual(1, result.result.n);
 res.redirect('/');
 });
 });
});
// Create Sales collection and insert 10 documents
app.post('/createSales', (req, res) => {
 // Get form data from request body
 const { id, name, publisher, genre, rating, global_sales } = req.body;
 // Insert document into Sales collection
 client.connect((err) => {
 assert.strictEqual(null, err);
 const db = client.db(dbName);
 const sales = db.collection('sales');
 sales.insertOne({
 id: parseInt(id),
 name: name,
 publisher: publisher,
 genre: genre,
 rating: parseFloat(rating),
 global_sales: parseFloat(global_sales)
 }, (err, result) => {
 assert.strictEqual(null, err);
 assert.strictEqual(1, result.result.n);
 res.redirect('/');
 });
 });
});
// Query for games with platform starting with "PS" and release year between
1996 and 2000
app.get('/gamesQuery', (req, res) => {
 client.connect((err) => {
 assert.strictEqual(null, err);
 const db = client.db(dbName);
 const games = db.collection('games');
 games.find({
 platform: { $regex: /^PS/ },
 release_year: { $gte: 1996, $lte: 2000 }
 }).sort({ release_year: -1 }).toArray((err, result) => {
 assert.strictEqual(null, err);
 res.render('gamesQuery', { games: result });
 });
 });
});
// Query for sales with publisher released after 2015 and high rating, ordered
alphabetically by genre
app.get('/salesQuery', (req, res) => {
 client.connect((err) => {
 assert.strictEqual(null, err);
 const db = client.db(dbName);
 const sales = db.collection('sales');
 sales.find({
 publisher: { $regex: /released after 2015/i },
 rating: { $gte: 8 }
 }).sort({ genre: 1 }).toArray((err, result) => {
 assert.strictEqual(null, err);
 res.render('salesQuery', { sales: result });
 });
 })
});
app.listen(3000);