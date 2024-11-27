const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const {generateShort, redirectShort, getPrevShorts,urlState} = require('../controllers/url');

router.route('/').post(generateShort).get(getPrevShorts ); 

router.route('/:short').get(redirectShort);

router.route('/:short').put(urlState);


module.exports = router;