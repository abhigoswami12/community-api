var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User"},
    slug: { type: String },
    description: { type: String},
    tags: [{ type: String }],
    answers: [ { type: Schema.Types.ObjectId, ref: "Answer"}]
}, { timestamps: true });

questionSchema.pre("save", function(next) {
    if(this.title && this.isModified('title')) {
        this.slug = this.title.toLowerCase().trim().split(" ").join("-") + Math.floor(Math.random()*20000);
    }
    next();
})

module.exports = mongoose.model("Question", questionSchema);
