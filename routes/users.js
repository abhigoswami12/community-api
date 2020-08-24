var express = require('express');
var router = express.Router();

var User = require('../models/User');
var auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//registration
router.post('/', async (req, res, next) => {
  try {
    var user = await User.create(req.body.user);
    var token = await auth.generateToken(user);
    res.json({ user: generateUserFormat(user, token)})
  } catch (error) {
    next(error);
  }
})

//login
router.post('/login', async(req, res, next) => {
  var { email, password } = req.body.user
  try {
    if(!email || !password) {
      return res.status(400).json({ error: "email/password required"})
    }
    var user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ msg: "email not registered.Please enter correct email address!!"})
    }
    var result = await user.validatePassword(password);
    if(!result) {
      return res.status(400).json({ msg: "Eneterd password is wrong. Please enter correct password!!" })
    }
    var token = await auth.generateToken(user);
    res.json({ user: generateUserFormat(user, token )})
    
  } catch (error) {
    next(error);
  }
})

//current user
router.get('/current-user',auth.validateToken, async (req, res, next) => {
  try {
    var user = await User.findById(req.user.userId);
    res.json({ user: generateUserFormat(user, req.user.token)});
  } catch (error) {
    next(error);
  }
})

function generateUserFormat(user, token) {
  return {
    email: user.email,
    username: user.username,
    token
  }
}

module.exports = router;
