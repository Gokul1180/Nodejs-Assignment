const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name']
    },
    phoneno: {
        type: String,
        unique: [true, 'This is phone number is already registered']
    },
    email: {
        type: String,
        unique: [true, 'This is email is already registered'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        minlength: [6, 'Minimun length for Password is 6 characters']
    },
    profileImg: {
        type: String
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(emailorphoneno, password) {
    const user = await this.findOne({
        $or: [
          { email: emailorphoneno },
          { phoneno: emailorphoneno },
        ],
      });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email or phone no');
}

const User = mongoose.model('user', userSchema);

module.exports = User;