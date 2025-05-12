require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 5000;
const userRoutes = require('./src/routes/userRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');

const app = express();

// Use port from environment or default
const port = process.env.PORT || 5000;

// Serve static files (like uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/property', propertyRoutes);
app.use('/user', userRoutes);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
