const express = require('express')
const router = express.Router()
const userModel = require('../models/user-model')
const isLoggedIn = require('../middlewares/isLoggedIn')
const productModel = require('../models/product-model')
router.get('/',function(req,res){
    let error=req.flash('error')
    res.render("index",{error,loggedin:0})
})
router.get('/shop',isLoggedIn,async(req,res)=>{
    let success = req.flash('success')
    let filter = req.query.filter    
    if(filter===undefined)filter='all'
    let query={}
    if(filter === 'discounted'){
        query.discount={$gt:0}        
    }
    
    let products = await productModel.find(query)
    res.render("shop",{products,success,filter, activeRoute: "/shop"})
})
router.get('/logout',isLoggedIn,(req,res)=>{
    res.render('/shop')
})

router.get('/addtocart/:id',isLoggedIn,async(req,res)=>{    
    let user =await userModel.findOne({email:req.user.email})
    let item = user.cart.find(i => i.product.toString() === req.params.id);
    if (item) {
        item.quantity++;
    } else {
        user.cart.push({ product: req.params.id, quantity: 1 });
    }
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
})
router.get('/cart',isLoggedIn,async(req,res)=>{    
    let user=await userModel.findOne({email:req.user.email}).populate("cart.product")        
    res.render("cart",{user,activeRoute: "/cart"})
})

router.get('/cart/increase/:id',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({_id:req.user._id})
    let item = user.cart.find(i => i.product.toString() === req.params.id);
    if (item) item.quantity++;
    await user.save();
    res.redirect('/cart');
})

router.get('/cart/decrease/:id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ _id: req.user._id });
    let index = user.cart.findIndex(i => i.product.toString() === req.params.id);
    if (index !== -1) {
        if (user.cart[index].quantity > 1) {
            user.cart[index].quantity--;
        } else {
            user.cart.splice(index, 1); // remove item
        }
    }
    await user.save();
    res.redirect('/cart');
});

router.get('/error',(req,res)=>{
    res.render('404')    
})

module.exports=router