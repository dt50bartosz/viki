const userModule = require('../models/userModel');  
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

// Your secret key (should be in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET;  // Make sure to set this in your .env file

async function loginUser(login, password) {
    const userName = "Viki234";  
    const passwordDefault = "123456789";  

    // Find the user by username
    const user = await userModule.findUserByUsername(login);

    if (!user) {
        // If the user doesn't exist, check for the default user and create if necessary
        const defaultUser = await userModule.findUserByUsername(userName);

        if (!defaultUser) {
            const createNewUser = await userModule.createNewUser(userName, passwordDefault);
            console.log('Default user created:', createNewUser);
        }
        return { success: false, message: 'User not found. Please try again.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        // If password is valid, generate a JWT token
        const payload = {
            userId: user._id,  // Include the user's ID in the payload for further verification
            username: user.username,  // Or any other user-specific data you want to include
        };

        console.log("secrete when jwt was created", JWT_SECRET)

        const token = jwt.sign(payload, JWT_SECRET); // Create a token that expires in 1 hour

        return {
            success: true,
            message: 'Login successful',
            user: user,
            token: token, // Send the token in the response
        };
    } else {
        return { success: false, message: 'Invalid username or password' };
    }
}

module.exports = { loginUser };
