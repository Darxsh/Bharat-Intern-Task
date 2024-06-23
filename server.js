const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create schema and model for User
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Route for serving the registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submissions
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Create a new user using the User model
    const newUser = new User({
        username,
        email,
        password
    });

    // Save the user to the database
    newUser.save()
        .then(() => {
            res.send('<script>alert("Registration successful!"); window.location.href = "/";</script>');
            // Alternatively, you can redirect using res.redirect('/')
        })
        .catch(err => {
            res.status(500).send('Failed to register user');
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
