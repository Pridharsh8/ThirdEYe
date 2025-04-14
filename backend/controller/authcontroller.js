const user = require('../models/user');  // Assuming the user model is correctly imported
const bcrypt = require('bcryptjs');      // Assuming you're using bcrypt for password hashing
const jwt = require('jsonwebtoken');

// Function to handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // Handle specific errors
    if (err.message.includes('User validation failed')) {
        if (err.message.includes('email')) {
            errors.email = 'That email is already registered';
        }
        if (err.message.includes('password')) {
            errors.password = 'Password must be at least 6 characters';
        }
    }

    // Return the error object
    return errors;
};

// Signup Route
const signup_post = async (req, res) => {
    const { mail, password } = req.body;
    
    // Validate the data before processing (e.g., check for empty fields)
    if (!mail || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        // Check if user already exists
        const existingUser = await user.findOne({ mail });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await user.create({ mail, password: hashedPassword });

        // Send success response
        res.status(200).json({ message: 'Signup successful', user: newUser });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ message: 'Error occurred during signup', error: errors });
    }
};

// Login Route
const login_post = async (req, res) => {
    const { mail, password } = req.body;

    // Validate the data before processing
    if (!mail || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        // Find the user by email
        const User = await user.findOne({ mail });
        console.log(User);

        if (!User) {
            // No user found with that email
            return res.status(400).json({ message: 'No user found with that email' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            // Password mismatch
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Login successful - Set the isLoggedIn status (alternative: use sessions or JWT)
        const isLoggedIn = true;

        // If using JWT, you could generate a token and send it to the client
        const token = jwt.sign({ userId: User._id }, 'secretKey', { expiresIn: '1h' });

        // Send success response
        res.status(200).json({
            message: 'Login successful',
            userId: User._id, // Corrected the user ID reference
            token, // Include the token if using JWT
            isLoggedIn: true // Optionally send back isLoggedIn status if you want to track the session client-side
        });
    } catch (err) {
        // Catching any server errors
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = { signup_post, login_post };
