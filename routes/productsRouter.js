const express =  require('express')
const router = express.Router()
const upload = require('../config/multer-config')
const productModel =require('../models/product-model')
const isOwner = require('../middlewares/isOwner')
const userModel=require('../models/user-model')

router.post("/create",upload.single('image'),async function(req,res){
     try{let {image,
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,    } = req.body    
    let product = await productModel.create({
        image:req.file.buffer,
         name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
    })    
    req.flash("success","Product Created Succesfully")
    res.redirect('/owners/allproducts')


}catch(err){
        res.send(err.message)
    }
})

router.get('/delete/:pid',isOwner,async(req,res)=>{
   try {       
        let users = await userModel.find()
          for (let user of users) {
          for(let i=0;i<user.cart.length;i++){            
            if(String(user.cart[i].product)===req.params.pid){                
                user.cart.splice(i,1); 
                await user.save();
                 break;
                }           
          }         
    }   
     await productModel.findByIdAndDelete(req.params.pid);
        req.flash("success", "Product deleted successfully");
        res.redirect('/owners/allproducts');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete product");
    }
})

router.use((req, res) => {
    res.status(404).render('404'); 
});

module.exports = router

