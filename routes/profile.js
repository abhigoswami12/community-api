var express = require('express');
var router = express.Router();

var User = require('../models/User');
var auth = require('../middlewares/auth');

router.get('/:username',auth.validateToken, async (req, res, next) => {
    try {
        var username = req.params.username;
        var user = await User.findOne({ username });
        res.json({ user: generateUserProfileFormat(user) })
    } catch (error) {
        next(error);
    }
})

router.put("/:username", auth.validateToken, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({ username }, req.body.user);
        res.json({ user: generateUserProfileFormat(user) })
    } catch (error) {
        next(error);
    }
})

function generateUserProfileFormat(user) {
    return {
        image: user.image,
        bio: user.bio,
        email: user.email,
        username: user.username
    }
}

module.exports = router;