var express = require('express');
var router = express.Router();
 
var Question = require('../models/Question')

router.get('/', async (req, res, next) => {
    try {
        var tags = await Question.find().distinct('tags');
        res.json({ tags })
    } catch (error) {
        next(error);
    }
})



module.exports = router;