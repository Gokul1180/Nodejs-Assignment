const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const handlerror = (err) => {
    let error = {name:"", emailorphoneno:"", password:"", email:"", phoneno:""};

    if (err.message == "incorrect email or phone no") {
        error.emailorphoneno = "Please Enter a valid Email or Phone Number";
        return error;
    }

    if (err.message == "incorrect password") {
        error.password = "Password is Incorrect!";
        return error;
    }

    if (err.code === 11000 && err.keyPattern.phoneno == 1) {
        error.phoneno = "This phone number is already registered";
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
    res.render('signup');
};

const signup_post = async (req, res) => {
    const {name, phoneno, email, password, filePath} = req.body;

    if(!phoneno && !email) {
        res.status(400).json({error: {emailorphoneno: "At least one of the email or phone number must be provided."}});
    }
    else {
        if(email == ""){
            email == null;
        }
        try{
            const user = await Users.create({name, phoneno, email, password, profileImg: filePath});
            const token = createJWT(user._id);
            res.cookie('JWT',token, { httpOnly: true, maxAge: maxAge * 1000});
            res.status(201).json({User:user});
        }
        catch (err) {
            console.log(err);
            const error = handlerror(err);
            res.status(400).json({error});
        }
    }
};

const login_get = (req, res) => {
    res.render('login');
};

const login_post = async (req, res) => {
    const { emailorphoneno, password } = req.body;

    try {
        const user = await Users.login(emailorphoneno, password);
        const token = createJWT(user._id);
        res.cookie('JWT',token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({User: user});
    }
    catch (err) {
        console.log(err);
        const error = handlerror(err);
        res.status(400).json({error});
    }
};

const editprofile_get = (req, res) => {
    res.render('editprofile');
};

const editprofile_post = async (req, res) => {
    const { userid, name, filePath } = req.body;

    try {
        if(filePath) {
            const user = await Users.findById({ _id: userid });
            const file = user.profileImg;
            fs.unlink(`./${file}`, async (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    const user = await Users.findByIdAndUpdate(userid, {name: name, profileImg: filePath});
                    res.status(200).json({User: user});
                }
            });
        }
        else {
            const user = await Users.findByIdAndUpdate(userid, {name: name});
            res.status(200).json({User: user});
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({err});
    }
};

const deleteprofile = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await Users.findById({ _id: id });
        const file = user.profileImg;
        fs.unlink(`./${file}`, async (err) => {
            if(err) {
                console.log(err);
            }
            else {
                await Users.findByIdAndDelete(id);
                res.status(200).json({result: "Profile Deleted Successfully"});
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

const home = (req, res) => {
    res.render('home');
};

const logout = (req, res) => {
    res.cookie('JWT', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    editprofile_get,
    editprofile_post,
    deleteprofile,
    home,
    logout
};
