const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const Admins = require('../models/admin');

const requireAuth = (req, res, next) => {
    const token = req.cookies.JWT;

    if (token) {
        jwt.verify(token,'bwi', (err, decodedToken) => {
            if (err) {
                console(err);
                res.redirect('/login');
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.JWT;

    if (token) {
        jwt.verify(token,'bwi', async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                let user = await Users.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
};

const checkAdmin = (req, res, next) => {
    const token = req.cookies.JWT;

    if (token) {
        jwt.verify(token,'bwi', async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.admin = null;
                next();
            }
            else {
                let user = await Admins.findById(decodedToken.id);
                res.locals.admin = user;
                next();
            }
        })
    }
    else {
        res.locals.admin = null;
        next();
    }
};

module.exports = { requireAuth, checkUser, checkAdmin };