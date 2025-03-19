const express = require('express');
const router = express.Router();
const users = require('../services/users');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

require('dotenv').config()
const SECRETKEY = process.env.SECRETKEY

function authenticationToken(req,res,next){

    const token = req.cookies.token
    console.log("Token:",  req.cookies)

    if (!token) return res.status(401).json({message:"Hozzáférés megtagadva, nincs token!"})
    
    jwt.verify(token, SECRETKEY, (err,user)=>{
        if (err) return res.status(401).json({message:"Hozzáférés megtagadva, érvénytelen token!"})
        req.user=user
        console.log("User", req.user)
        next()    
        })  
    }

router.get('/', async function(req, res, next) {
    try {
        res.json(await users.getDatas());
    }
    catch (err) {
        next(err);
    }
});

router.get("/secretdata", authenticationToken, async(req,res)=>{
    res.status(200).json({message:"Itt a titok!"})
})

router.get('/profile', authenticationToken, async function(req, res, next) { 
    try {
        const userId = req.user.id; 
        const rows = await users.getById(userId);
        if (!rows) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/register', async function(req, res, next) {
    let user = req.body
    console.log(user)
    user.password = await bcrypt.hash(user.password, 10);
    try {
        res.json(await users.create(user));
    }
    catch (err) {
        next(err);
    }
});

router.post("/login", async(req,res,next)=>{
    let {email, password}=req.body
    console.log("email", email)
    try{
        const user = await users.getMail(email);
        console.log("User", user)
      
        const passwordMatch = await bcrypt.compare(password, user.password)
        
        if (user && passwordMatch){
            const token = await jwt.sign({id:user.id}, SECRETKEY, {expiresIn:"10h"})
            res.cookie('token', token, {
                httpOnly:true,
                secure:true,
                sameSite:'none',
                maxAge:3600000
            })
            
            // const resUser= {...user, accessToken:token}
            const resUser= {...user}
            // delete resUser.password
            res.status(200).json(resUser)
        }
        else {
            res.status(401).send("Érvénytelen hitelesítést!")
        }
    
    }
    catch(error){
        console.log()
        next(error)
    }    
})

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    try {
      const result = await update(id, user, req);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

router.delete('/:id', authenticationToken, async function(req, res, next) { 
    try {
        res.json(await users.remove(req.params.id));
    }
    catch (err) {
        next(err);
    }
});

router.patch('/:id', authenticationToken, async function(req, res, next) { 
    try {
        res.json(await users.patch(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});

router.patch('/sadmin-update-profile/:id',authenticationToken, async(req, res)=>{
    const userId= req.params.id
    const allowedFields = ['first_name', 'last_name', 'gender', 'email', 'address', 'phone_number','active', 'isadmin', ];
    const updateData = {}
    allowedFields.forEach( field=>{
        if (req.body[field] !== undefined) updateData[field]= req.body[field]
    })

    console.log("(Sadmin) UpdateData: ", updateData)

    if (Object.keys(updateData).length==0) 
        return res.status(400).json({"message":"Nem küldtél frissítendő adatokat!"})

    try {
        console.log();
        console.log("ID", userId)
        console.log("UpdateData", updateData)
        const updateUser= await users.update(userId, updateData)
        res.json({message:"Profil frissítve!", user:updateUser})
    }
    catch(err){
        console.log(err);
        res.status(500).send("Hiba történt a profil frissítésekor!")
    }
})

router.post("/logout", authenticationToken, async(req,res)=>{
    res.cookie('token', '', {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        expires: new Date(0)
    })
    res.status(200).json({message:"A kijelentkezés sikeres!"})
})

router.get('/isAdmin/:id', async function(req, res, next) {
    const id = req.params.id;
    try {
        const isAdmin = await users.isAdmin(id);
        res.json(isAdmin);
    }
    catch (err) {
        next(err);
    }   
});

module.exports = router;
