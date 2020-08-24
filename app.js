var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');
var tagsRouter = require('./routes/tags');


require('dotenv').config();
mongoose.connect("mongodb://localhost/community-api", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => console.log("Connected", err? err: true))

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/answers', answersRouter);
app.use('/api/tags', tagsRouter);

module.exports = app;
