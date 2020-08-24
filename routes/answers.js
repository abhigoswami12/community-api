var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');
var Answer = require('../models/Answer');
var Question = require('../models/Question');



router.put('/:answerId',auth.validateToken, async (req, res, next) => {
    var answerId = req.params.answerId;
    try {
        var answer = await Answer.findOne({ _id: answerId }).populate('author', "_id username")
        if(answer.author._id.toString() === req.user.userId) {
            answer.text = req.body.text;
            answer.save();
            res.json(answer)
        } else {
            res.status(400).json({ msg: "you need to be the author of the answer to edit it!!"})
        }
    } catch (error) {
        next(error);
    }
})
router.delete('/:answerId', auth.validateToken, async (req, res, next) => {
    var answerId = req.params.answerId;
    try {
        var answer = await Answer.findById(answerId);
        if(answer) {
            if(answer.author.toString() === req.user.userId) {
                answer.remove();
                answer.save();
                await Question.findByIdAndUpdate(answer.questionId, { $pull: { answers: answerId}});
                res.json(answer);
            } else {
                res.status(400).json({ msg: "you must be the author of the answer to delete it!!"})
            }

        } else {
            res.status(400).json({ msg: "answer already deleted!!"})
        }
    } catch (error) {
        next(error);
    }
})



module.exports = router;