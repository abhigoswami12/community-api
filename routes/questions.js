var express = require('express');
var router = express.Router();

var Question = require('../models/Question');
var auth = require('../middlewares/auth');
var Answer = require('../models/Answer');


//create question
router.post('/',auth.validateToken, async (req, res, next) => {
    req.body.question.author = req.user.userId;
    try {
        var question = await Question.create(req.body.question);
        var populatedQuestion = await Question.findById(question._id).populate("author", "_id username")
        res.json({ populatedQuestion });
    } catch (error) {
        next(error);
    }
});


//create answer
router.post('/:questionId/answers',auth.validateToken, async (req, res, next) => {
    var questionId = req.params.questionId;
    req.body.author = req.user.userId;
    req.body.questionId = questionId;
    try {
       var answer = await Answer.create(req.body);
       var question = await Question.findByIdAndUpdate( questionId, { $push: {answers: answer._id }});
    var populatedAnswer = await Answer.findById(answer._id).populate('author', "_id username").exec();
    res.json(populatedAnswer);
    } catch (error) {
        next(error);
    }
})

//list all answers
router.get('/:questionId/answers', auth.validateToken, async (req, res, next) => {
    var questionId = req.params.questionId;
    var question = await Question.findOne({ _id: questionId }).populate({
        path: 'answers',
        populate: {
            path: 'author',
            select: "_id username"
        }
    }).exec();
    var answers = question.answers;
    res.json({answers});
})

//list single question
router.get('/:questionId', async (req, res, next) => {
    var questionId = req.params.questionId;
    try {
        var question = await Question.findById(questionId).populate('author', "_id username").populate({
            path: 'answers',
            populate: {
                path: 'author',
                select: '_id username'
            }
        }).exec();
        res.json({ question });
    } catch (error) {
        next(error);
    }
})

//list all questions
router.get('/', async (req, res, next) => {
    try {
        var questions = await Question.find({}, "-answers").populate("author", "_id username").exec();
        res.json({ questions });
    } catch (error) {
        next(error);
    }
})

//update question
router.put('/:questionId', auth.validateToken, async (req, res, next) => {
    var questionId = req.params.questionId;
    try {
        var updatedQuestion = await Question.findByIdAndUpdate(questionId, req.body.question);
        // console.log(updatedQuestion);
        if(updatedQuestion.author.toString() === req.user.userId) {
            res.json({question: updatedQuestion });

        } else {
            res.status(400).json({ msg: "you must be the author of the question to update it!!"})
        }
    } catch (error) {
        next(error);
    }
})



//delete question
router.delete('/:questionId', auth.validateToken, async (req, res, next) => {
    var questionId = req.params.questionId;
    try {
        var question = await Question.findById(questionId);
        if(question) {
            if(question.author.toString() === req.user.userId) {
                // var answers = await Answer.find({_id:question.answers});
                // answers.forEach(answer => answer.remove());
                question.remove();
                res.json({ question });
            } else {
                res.status(400).json({ msg: "you must be the author of the question to delete the article!!"})
            }
        } else {
            res.status(400).json({ msg: "Question already deleted!!" });
        }
        await Answer.deleteMany({questionId: question._id})
    } catch (error) {
        next(error);
    }
})



module.exports = router;


