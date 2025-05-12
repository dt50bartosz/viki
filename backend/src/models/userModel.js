const bcrypt = require('bcrypt');
const db = require('../config/database');

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, user) => {
            if (err) {
                return reject(err);  
            }
            resolve(user); 
        });
    });
};

const checkPassword = (enteredPassword, storedHashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(enteredPassword, storedHashedPassword, (err, isMatch) => {
            if (err) {
                return reject(err);  
            }
            resolve(isMatch);  
        });
    });
};

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashedPassword);
            }
        });
    });
};

// Function to create a new user
const createNewUser = async (username, password) => {
    try {
        const hashedPassword = await hashPassword(password);
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

        return new Promise((resolve, reject) => {
            db.run(sql, [username, hashedPassword], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        username,
                        password: hashedPassword,
                    });
                }
            });
        });
    } catch (err) {
        throw new Error(`Error creating user: ${err.message}`);
    }
};

module.exports = {
    findUserByUsername,
    checkPassword,
    createNewUser
};
