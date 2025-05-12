const express = require('express');
const router = express.Router();
const {loginUser} = require('../controllers/userController')

router.post('/login', async (req, res) => {

   console.log("XDD")
  
   try {
     const result = await loginUser(req,res);
      console.log("results",result);
  
      if (result.success) {
        console.log("cf");
        res.cookie('auth_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          
        });
  
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;
