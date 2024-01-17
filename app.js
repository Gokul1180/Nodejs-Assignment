const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { requireAuth, checkUser, checkAdmin } = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false}));
app.set('view engine','ejs');

const dbUser = 'mongodb+srv://Gokul1180:gokul1180@cluster0.dijbotj.mongodb.net/bwi?retryWrites=true&w=majority';
mongoose.connect(dbUser)
    .then((result) => app.listen(4000))
    .catch((err) => console.log(err));

app.get('*', checkUser, checkAdmin);
app.post('*', checkUser, checkAdmin);

//Have added an admin manually in the database so that the admin can add more admins if needed.

app.get('/', requireAuth, (req, res) => {
    if(res.locals.user) {
        res.render('home');
    }
    else if(res.locals.admin) {
        res.redirect('/adminhome');
    }
});

app.use(adminRoutes);
app.use(userRoutes);