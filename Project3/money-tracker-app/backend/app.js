const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/transactions', require('./routes/transactions'));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for single-page applications
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
