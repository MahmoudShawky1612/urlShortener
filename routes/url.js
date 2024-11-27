const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const {generateShort, redirectShort, getPrevShorts} = require('../controllers/url');

router.route('/').post(generateShort).get( verifyToken,getPrevShorts );

router.route('/:short').get(redirectShort);



module.exports = router;