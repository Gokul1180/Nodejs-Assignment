const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true);
        }
        else {
            console.log("Only JPG and PNG files supported!");
            cb(null, false);
        }
    } 
});

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);
router.get('/login', userController.login_get);
router.post('/login', userController.login_post);
router.get('/editprofile', requireAuth, userController.editprofile_get);
router.post('/editprofile', requireAuth, userController.editprofile_post);
router.delete('/deleteprofile', requireAuth, userController.deleteprofile);
router.get('/home', requireAuth, userController.home);
router.get('/logout', userController.logout);

router.post('/upload', upload.single('profileImg'), (req, res) => {
    const filePath = req.file.path;
    res.status(200).json({result: "Image Uploaded Successfully!", filePath});
});

module.exports = router;