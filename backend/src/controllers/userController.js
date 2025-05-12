const userService = require('../services/authService')

// Login handler
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const result = await userService.loginUser(username, password);
    return result; // just return the result, don't send a response
  } catch (error) {
    console.error('Login error:', error.message);
    return { success: false, message: error.message || 'Invalid credentials' };
  }
}
module.exports = { loginUser };