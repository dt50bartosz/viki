// middleware/attachDb.js
const db = require('../config/database');

function attachDb(req, res, next) {
  req.db = db;  // Make db available in req  
  next();
}

module.exports = attachDb;
