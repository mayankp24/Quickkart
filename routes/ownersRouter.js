const express =  require('express')
const router = express.Router()
const ownerModel = require('../models/owner-model')
const isOwner = require('../middlewares/isOwner')
const bcrypt = require('bcrypt')
const {generateToken }= require('../utils/generatetoken')
const productModel = require('../models/product-model')
const upload = require('../config/multer-config')
const userModel=require('../models/user-model')
if(process.env.NODE_ENV==="development"){
router.post("/create",async(req,res)=>{
    let owners = await ownerModel.find();
    if(owners.length>0)return res.status(503).send("You don't have permission to create a new owner")            
        let {fullname,email,password,contact}=req.body
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                let createdowner = await ownerModel.create({
            fullname,
            email,
            password:hash,                              
    })  
    let user =await  userModel.create({
        fullname,email,password:hash,contact,
    })
    res.status(201).send("success")
            })
        })                      
    })
}

router.post('/editpro/:pid', isOwner, upload.single('image'), async (req, res) => {
    const { name, price, discount, panelcolor, bgcolor, textcolor } = req.body;

    
    const updateData = {
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    };

    
    if (req.file) {
        updateData.image = req.file.buffer;
    }

    
    await productModel.findByIdAndUpdate(req.params.pid, updateData);

    req.flash("success", "Product Updated Successfully");
    res.redirect('/owners/allproducts');
});


 router.get("/login",(req,res)=>{
    res.render('owner-login',{loggedin:0})
 })

 router.get('/editprod/:id',isOwner,async(req,res)=>{
    let product = await productModel.findOne({_id:req.params.id})
    res.render('EditPro',{product,loggedin:2})
 })

router.get('/allproducts',isOwner,async(req,res)=>{
    let products = await productModel.find()
    let success = req.flash('success')
    res.render('admin',{products,success,loggedin:2,activeRoute: "/owners/allproducts"})
})

 router.post("/login",async(req,res)=>{
    let {email,password} = req.body
    //console.log("before")
    let owner = await ownerModel.findOne({email})
    //console.log("after")
    if(!owner)return res.send("Email Or Password Incorrect")
    else{                                      
                bcrypt.compare(password,owner.password,(err,result)=>{
                     if(err)return res.send(err.message)
                    if(result){
                        let token = generateToken(owner)
                        res.cookie("token",token)                
                        return res.redirect("/owners/admin")
                    }
                    else{
                         return res.send("Email Or Password Incorrect")
                    }
                })            
    }
 })
router.get("/admin",isOwner,function(req,res){
    let success = req.flash("success")        
    res.render("createproducts",{success,loggedin:2,activeRoute: "/owners/admin"})
})

router.get("/create-dummy", async (req, res) => {
    try {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("An admin/owner already exists. You cannot create a dummy admin.");
        }

        const email = "admin@gmail.com";
        const password = "admin";
        const fullname = "Admin User";

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500).send(err.message);
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(500).send(err.message);

                await ownerModel.create({
                    fullname,
                    email,
                    password: hash,
                    isadmin: true
                });

                await userModel.create({
                    fullname,
                    email,
                    password: hash,
                    contact: "1234567890"
                });

                res.send(`
                    <div style="font-family: sans-serif; padding: 40px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #4f46e5;">Dummy Admin Created Successfully!</h2>
                        <p>Use the credentials below to log in:</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 16px;">
                            <strong>Email:</strong> admin@gmail.com<br>
                            <strong>Password:</strong> admin
                        </div>
                        <br>
                        <a href="/owners/login" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Login</a>
                    </div>
                `);
            });
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.use((req, res) => {
    res.status(404).render('404'); 
});

module.exports = router

