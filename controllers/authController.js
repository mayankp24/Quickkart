const userModel = require('../models/user-model')
const bcrypt=  require('bcrypt')
const jwt= require("jsonwebtoken")
const {generateToken} =require('../utils/generatetoken')
const path=require('path')
const fs=require('fs')
module.exports.registerUser = async (req, res) => {
    try {
        let { email, fullname, password, contact } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(401).send("You already have an account, please login");

        // Load default profile image
        const defaultImagePath = path.join(__dirname, '..', 'assets', 'placeholder.jpg');
        const defaultImageBuffer = fs.readFileSync(defaultImagePath);

        // Generate hash
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.send(err.message);

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message);

                let newUser = await userModel.create({
                    email,
                    password: hash,
                    fullname,
                    contact,
                    picture: defaultImageBuffer 
                });

                let token = generateToken(newUser);
                res.cookie("token", token);
                res.redirect("/");
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async(req,res)=>{
    let {email,password}    = req.body
    let user = await userModel.findOne({email})
    if(!user)return res.send("User not found")
    else{
        bcrypt.compare(password,user.password,(err,result)=>{
             if(err)return res.send(err.message)
            if(result){
                let token = generateToken(user)
                res.cookie("token",token)                
                return res.redirect("/shop")
            }
            else{
                 return res.send("Something Went wrong")
            }
        })
    }
}

module.exports.logout = function(req,res){
    res.cookie("token","")
    res.redirect("/")
}

