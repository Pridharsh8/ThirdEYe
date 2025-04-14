const express = require('express');
const { signup_post, login_post } = require('./controller/authcontroller');
 // Correct path to your controller
const app = express();
const PORT = 5002;

app.use(express.json());  // Middleware to parse JSON bodies

// Route to handle signup POST requests
app.post('/signup', signup_post);

// Route to handle login POST requests
app.post('/login', login_post);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
