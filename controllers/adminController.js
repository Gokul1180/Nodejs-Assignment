const Admins = require('../models/admin');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const handlerror = (err) => {
    let error = {name:"", password:"", email:"",};

    if (err.message == "incorrect email") {
        error.emailorphoneno = "Please Enter a valid Email";
        return error;
    }

    if (err.message == "incorrect password") {
        error.password = "Password is Incorrect!";
        return error;
    }

    if (err.code === 11000 && err.keyPattern.email == 1) {
        error.email = "This email is already registered";
        return error;
    }

    Object.values(err.errors).forEach(({properties}) => {
        error[properties.path] = properties.message;
    });
    console.log(error);
    return error;
}

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
    const token = jwt.sign({ id }, 'bwi', {
        expiresIn: maxAge
    });

    return token;
}

const signup_get = (req, res) => {
    res.render('adminsignup');
};

const signup_post = async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const admin = await Admins.create({name, email, password});
        const token = createJWT(admin._id);
        res.cookie('JWT',token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({Admin:admin});
    }
    catch (err) {
        console.log(err);
        const error = handlerror(err);
        res.status(400).json({error});
    }
};

const login_post = async (req, res) => {
    const { emailorphoneno, password } = req.body;

    try {
        const admin = await Admins.login(emailorphoneno, password);
        const token = createJWT(admin._id);
        res.cookie('JWT',token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({Admin: admin});
    }
    catch (err) {
        console.log(err);
        const error = handlerror(err);
        res.status(400).json({error});
    }
};

const editprofile_get = async (req, res) => {
    const id = req.params.id;
    const user = await Users.findById(id);

    res.render('editprofile', {user});
};

const editprofile_post = async (req, res) => {
    const { adminid, name } = req.body;

    try {
        const admin = await Admins.findByIdAndUpdate(adminid, {name});
        res.status(200).json({Admin: admin});
    }
    catch (err) {
        console.log(err);
        const error = handlerror(err);
        res.status(400).json({error});
    }
};

const deleteprofile = async (req, res) => {
    const { id } = req.body;

    try {
        await Admins.findByIdAndDelete(id);
        res.status(200).json({result: "Profile Deleted Successfully"});
    }
    catch (err) {
        console.log(err);
    }
};

const logout = (req, res) => {
    res.cookie('JWT', '', {maxAge: 1});
    res.redirect('/');
}

const home = async (req, res) => {
    const users = await Users.find();
    res.render('adminhome', {users});
}

const adminprofile = (req, res) => {
    res.render('adminprofile');
}

const admineditprofile = async (req, res) => {
    res.render('admineditprofile')
}

module.exports = {
    signup_get,
    signup_post,
    login_post,
    editprofile_get,
    editprofile_post,
    deleteprofile,
    logout,
    home,
    adminprofile,
    admineditprofile
};