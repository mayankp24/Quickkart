const express =  require('express')
const router = express.Router()
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const bcrypt=require('bcrypt')
const {registerUser,loginUser,logout}=require('../controllers/authController')
const isLoggedIn = require('../middlewares/isLoggedIn')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/logout',logout)

router.get('/account',isLoggedIn,(req,res)=>{
    let user = req.user
    res.render('UserAccount',{user,activeRoute: "/users/account"})    
})

router.post('/changepic', isLoggedIn, upload.single('profpic'), async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).send("User not found");

        // Save the uploaded image buffer
        user.picture = req.file.buffer;
        await user.save();

        res.redirect('/users/account');
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

router.use((req, res) => {
    res.status(404).render('404'); 
});

module.exports = router