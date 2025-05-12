const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../middlewares/multerConfig');
const verifyToken = require('../middlewares/jwtMiddleware');

router.post('/add-property', upload(),verifyToken, propertyController.addProperty);
router.get('/all-properties' , propertyController.getAllProperties);
router.delete('/delete',verifyToken, propertyController.deleteProperty);
router.patch('/sold',verifyToken ,propertyController.markAsSold);
router.get('/lates-property',propertyController.latesProperty);
router.get('/search',propertyController.searchProperties);
router.get('/property-by-title/:title', propertyController.fetchProperty);
router.get('/edit-property:title',verifyToken, propertyController.editProperty);
module.exports = router;
