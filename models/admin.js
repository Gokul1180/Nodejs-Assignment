const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name']
    },
    email: {
        type: String,
        unique: [true, 'This is email is already registered'],
        lowercase: true,
        validate: [isEmail, 'Please Enter a valid email id']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        minlength: [6, 'Minimun length for Password is 6 characters']
    }
});

adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.statics.login = async function(email, password) {
    const admin = await this.findOne({ email });
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
            return admin;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;