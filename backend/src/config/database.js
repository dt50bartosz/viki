// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');

// Open a connection to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite3 database');
  }
});

// Create the users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating the users table:', err);
  } else {
    console.log('Users table is ready');
  }
});

// Create the towns table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS towns (
    town_id INTEGER PRIMARY KEY AUTOINCREMENT,
    town_name TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Error creating the towns table:', err);
  } else {
    console.log('Towns table is ready');
  }
});

// Create the properties table if it doesn't exist
// Create the properties table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS properties (
    property_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    orientation TEXT,
    property_type TEXT,
    property_condition TEXT,
    useful_area INTEGER,
    total_area INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    year_of_construction INTEGER,
    price DECIMAL(10, 2),
    ibi INTEGER,
    community INTEGER,
    description TEXT,
    town INTEGER,
    postal_code TEXT,
    street TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    seller_name TEXT,
    telephone TEXT,
    photos TEXT,
    items TEXT,
    status INTEGER DEFAULT 1,  -- BOOLEAN: 1 = true (active), 0 = false (inactive)
    FOREIGN KEY (town) REFERENCES towns(town_id),
    CONSTRAINT unique_property_id UNIQUE (property_id),
    CONSTRAINT unique_property_title UNIQUE (title)
  );
`, (err) => {
  if (err) {
    console.error('Error creating the properties table:', err);
  } else {
    console.log('Properties table is ready');
  }
});



// Create the property_items table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS property_items (
    property_id TEXT,
    item_name TEXT,
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating the property_items table:', err);
  } else {
    console.log('Property Items table is ready');
  }
});

// Create the property_photos table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS property_photos (
    photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id TEXT,
    photo_url TEXT,
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating the property_photos table:', err);
  } else {
    console.log('Property Photos table is ready');
  }
});

// Create indexes
db.run(`
  CREATE INDEX IF NOT EXISTS idx_property_title ON properties(title);
`, (err) => {
  if (err) {
    console.error('Error creating the index on property title:', err);
  } else {
    console.log('Index on property title created');
  }
});

module.exports = db;
