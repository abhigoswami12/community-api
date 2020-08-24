var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String},
  image: { type: String, default: null},
  bio: {type: String, default: null}
}, { timestamps: true });

//presave hook to hash password
userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//validate password while login
userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}



module.exports = mongoose.model("User", userSchema);