const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/adminsignup', adminController.signup_get);
router.post('/adminsignup', adminController.signup_post);
router.post('/adminlogin', adminController.login_post);
router.get('/admineditprofile/:id', requireAuth, adminController.editprofile_get);
router.get('/admineditprofile', requireAuth, adminController.admineditprofile);
router.post('/admineditprofile', requireAuth, adminController.editprofile_post);
router.delete('/admindeleteprofile', requireAuth, adminController.deleteprofile);
router.get('/adminhome', requireAuth, adminController.home);
router.get('/adminlogout', requireAuth, adminController.logout);
router.get('/adminprofile', requireAuth, adminController.adminprofile);

module.exports = router;