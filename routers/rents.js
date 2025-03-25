const express = require('express');
const router = express.Router();
const rents = require('../services/rents');
const nodemailer = require("nodemailer");
const moment = require('moment');
const users = require('../services/users');

router.get('/', async (req, res, next) => {
  try {
    res.json(await rents.getRents());
} catch (err) {
    next(err);
}
});

router.get('/:id', async (req, res, next) => {
  const userID = req.params.id;
    try {
        const rent = await rents.getRentsByUserID(userID);
        res.json(rent);
    } catch (err) {
        next(err);
    }
});


router.post('/', async (req, res, next) => {
  console.log('Request body:', req.body);
  const { userID, placeID, startDate, endDate } = req.body;

  try {
      // Létrehozzuk a foglalást
      const result = await rents.createRent(userID, placeID, startDate, endDate);


      // Dátumok formázása
      const formattedStartDate = moment(startDate).format('YYYY.MM.DD. HH:mm');
      const formattedEndDate = moment(endDate).format('YYYY.MM.DD. HH:mm');

      // Felhasználó adatainak lekérése a userID alapján
      const user = await users.getById(userID); // Feltételezve, hogy van egy getUserByID függvényed, amely a felhasználó adatait adja vissza

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Nodemailer beállítások
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: "feketejanosdavid@ktch.hu",  // Alkalmazás jelszóval
              pass: "btfd turg piah twqp",  // Az alkalmazás jelszót használd itt
          },
      });

      // E-mail opciók
      const mailOptions = {
        from: '"Kezdőrugás Csapata" <feketejanosdavid@ktch.hu>',
        to: user.email,  // A felhasználó e-mail címe
        subject: "🎉 Sikeres foglalás - Kezdőrugás Csapata 🏆",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f7fc; padding: 20px; border-radius: 8px;">
                <h2 style="color: #2d8b99;">Kedves ${user.first_name} ${user.last_name}! 👋</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Örömmel értesítünk, hogy sikeresen létrehoztad a foglalásodat! 🎉<br><br>
                    Az alábbiakban találod a foglalás részleteit:
                </p>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">🗓️ Kezdési időpont:</td>
                        <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${formattedStartDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #eef7f8; font-weight: bold;">🗓️ Befejezési időpont:</td>
                        <td style="padding: 10px; background-color: #eef7f8; font-weight: normal;">${formattedEndDate}</td>
                    </tr>
                </table>
                <p style="font-size: 16px; margin-top: 20px;">
                    Kérjük, hogy ha bárminemű változtatásra van szükséged, vedd fel velünk a kapcsolatot.<br><br>
                    Bízunk benne, hogy minden tökéletes lesz a foglalásoddal kapcsolatban! 💪
                </p>
                <p style="font-size: 16px; font-weight: bold; color: #2d8b99;">
                    A Kezdőrugás csapata 🎯
                </p>
                <footer style="margin-top: 40px; font-size: 14px; color: #888;">
                    <p>Ha nem te végezted el ezt a foglalást, kérjük, azonnal vedd fel velünk a kapcsolatot!</p>
                </footer>
            </div>
        `,
    };

      // E-mail küldése
      await transporter.sendMail(mailOptions);

      // Válasz küldése a kliensnek
      res.json({ message: 'Rent successfully created', result });
  } catch (err) {
      console.error('Error creating rent:', err);
      next(err);
  }
});


router.post('/check-availability', async (req, res, next) => {
    const { date, time, placeID } = req.body;
    try {
      const rentsList = await rents.getRents();
      const conflicts = rentsList.filter(rent => rent.placeID === placeID && rent.startDate <= date && rent.endDate >= date);
      if (conflicts.length > 0) {
        res.json({ success: false, message: 'Room is not available for rent!' });
      } else {
        res.json({ success: true, message: 'Room is available for rent!' });
      }
    } catch (err) {
      next(err);
    }
  });

router.delete('/:userID/:rentID', async (req, res, next) => {
    try {
        res.json(await rents.cancelRent(req.params.userID, req.params.rentID));
    } catch (err) {
        next(err);
    }
});

router.put('/:userID/:rentID', async (req, res, next) => {
    console.log(req.params, req.body)
    try {
        res.json(await rents.updateRent(req.params.userID, req.params.rentID, req.body.startDate,  req.body.endDate, req.body.status));
    } catch (err) {
        next(err);
    }
});

router.get('/:userID/:rentID', async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const rents = await rents.getStatus(userID);
        res.json(rents);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
