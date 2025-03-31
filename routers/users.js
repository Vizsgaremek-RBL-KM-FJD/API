const express = require('express');
const router = express.Router();
const users = require('../services/users');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const db = require('../services/db');

require('dotenv').config()
const SECRETKEY = process.env.SECRETKEY

function authenticationToken(req,res,next){

    const token = req.cookies.token
    console.log("Token:",  req.cookies)
    console.log("Bodí",req.body)

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
    let user = req.body;
    console.log(user);

    try {
        // Jelszó titkosítása
        user.password = await bcrypt.hash(user.password, 10);

        // Felhasználó létrehozása
        const createdUser = await users.create(user);

        // E-mail küldése a regisztráció után
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "feketejanosdavid@ktch.hu",
                pass: "btfd turg piah twqp", // Alkalmazás jelszót használsz?
            },
        });

        const mailOptions = {
            from: '"Kezdőrugás csapata" <feketejanosdavid@ktch.hu>',
            to: user.email,
            subject: "🎉 Sikeres regisztráció - Kezdőrugás Csapata 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f7fc; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #2d8b99;">Kedves ${user.first_name} ${user.last_name}! 👋</h2>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Örömmel értesítünk, hogy sikeresen regisztráltál a Kezdőrugás oldalára! 🚀<br><br>
                        Most már a legjobb helyen vagy, így indulhat is a bérlés / bérbe adás!
                    </p>
                    <h3 style="color: #2d8b99;">Az adataid:</h3>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">👤 Név:</td>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${user.first_name} ${user.last_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">📧 E-mail:</td>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${user.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">📞 Telefonszám:</td>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${user.phone_number}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">🏠 Cím:</td>
                            <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${user.address}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; margin-top: 20px;">
                        Köszönjük, hogy csatlakoztál a közösséghez! Ne habozz kérdezni bármilyen segítséggel kapcsolatban. 💬<br><br>
                        Üdvözlettel,<br>
                        A Kezdőrugás Csapata 🎯
                    </p>
                    <footer style="margin-top: 40px; font-size: 14px; color: #888;">
                        <p>Ha nem te végezted el ezt a regisztrációt, kérjük, azonnal vedd fel velünk a kapcsolatot!</p>
                    </footer>
                </div>
            `,
        };

        // E-mail küldése, majd a válasz visszaküldése
        await transporter.sendMail(mailOptions);

        // Válasz küldése a kliensnek
        return res.json(createdUser);
    } catch (err) {
        next(err);
        return res.status(500).json({ error: "Hiba a regisztráció során." });
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
                maxAge:36000000
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

router.get('/:id', async function(req, res, next) {
    const id = req.params.id;
    try {
        const user = await users.getById(id);
        res.json(user);
    }
    catch (err) {
        next(err);
    }   
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await users.getMail(email);
    if (!user) {
        return res.status(404).json({ message: 'A felhasználó nem található!' });
    }
    
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    const expiresDate = new Date();
    console.log("Eredeti idő:", expiresDate.toISOString());
    expiresDate.setHours(expiresDate.getHours()+3);
    console.log("Változtatott idő:", expiresDate.toISOString());
    user.resetPasswordExpires = expiresDate.toISOString().replace('T', ' ').replace('Z', '');
    console.log("userid", user.ID, "resetPawwordToken", user.resetPasswordToken, "resetPasswordExpires", user.resetPasswordExpires)
    await users.updateToken(user.ID, user.resetPasswordToken, user.resetPasswordExpires);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "feketejanosdavid@ktch.hu",
            pass: "btfd turg piah twqp",
        },
    });
    const mailOptions = {
        from: '"Kezdőrugás Csapata" <feketejanosdavid@ktch.hu>',
        to: user.email,
        subject: "Jelszö visszaállítás",
        text: `Kattints a linkre a jelszó visszaállításához: http://localhost:4200/reset-password/${token}`,
        // Add this line
        url: `http://localhost:4200/reset-password/${token}`,
      };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Email küldési hiba' });
            
        }
        res.json({ message: 'Jelszó visszaállítás emailben el lett küldve!' });
    })
})

// router.patch('/reset-password', async (req, res, next) => {
//     console.log("usersroputer reqbody",req.body);
//     const { resetPasswordToken, password } = req.body;
    
//     if (!resetPasswordToken || !password) {
//       return res.status(400).json({ message: 'Invalid request: resetPasswordToken and password are required' });
//     }
//     try {
//       res.json(await users.resetPassword(resetPasswordToken, password));
//     } catch (err) {
//       next(err);
//     }
//   })

router.put('/reset-password', async (req, res, next) => {
    console.log("usersroputer reqbody",req.body);
    let { resetPasswordToken, password } = req.body;
    password = await bcrypt.hash(password, 10);
    if (!resetPasswordToken || !password) {
      return res.status(400).json({ message: 'Invalid request: resetPasswordToken and password are required' });
    }
    try {
      res.json(await users.resetPassword(resetPasswordToken, password));
    } catch (err) {
      next(err);
    }
  })



module.exports = router;
