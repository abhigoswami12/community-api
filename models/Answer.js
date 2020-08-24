var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var answerSchema = new Schema({
    text: { type: String, required: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question"},
    author: { type: Schema.Types.ObjectId, ref: "User"}
}, { timestamps: true })

module.exports = mongoose.model("Answer", answerSchema);