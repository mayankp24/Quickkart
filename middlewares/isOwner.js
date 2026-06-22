const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model')
const ownerModel=require('../models/owner-model')
const {generateToken }= require('../utils/generatetoken')
module.exports = async function(req,res,next){
    if(!req.cookies.token){        
        return res.redirect('/owners/login')        
    }
    try{    
         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
         let owner = await ownerModel.findOne({email:decoded.email}).select("-password")
        if(!owner){
            return res.redirect('/owners/login')
        }
        else{                       
            req.owner = owner
            next()
    }
    }catch(err){
        req.flash("error", err.message)
        res.redirect('/')

    }
}