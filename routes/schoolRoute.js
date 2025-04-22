const express = require('express');
const Schools = require('../data/schooldata');

const router = express.Router();


router.post('/addSchool', Schools.addSchool);
router.get('/listSchools', Schools.listSchools);

module.exports = router;