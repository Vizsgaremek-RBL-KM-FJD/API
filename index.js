const express = require('express');

const usersRouter = require('./routers/users');
const placesRouter = require('./routers/places');
const rentsRouter = require('./routers/rents');

const cookieParser = require("cookie-parser")
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
app.use(express.json());

const port = 3000;

app.use(cors(
    {origin:["http://localhost:4200", "https://localhost:4200"],
     credentials:true   
    }))

app.use(bodyParser.json())
app.use(cookieParser());

const options = {
    passphrase: "alma",
    pfx: fs.readFileSync("./localhost.pfx")
}


app.get('/', (req, res) => {
    res.json({"message": "OK, working!"})
});

app.use('/users', usersRouter);
app.use('/places', placesRouter);
app.use('/rents', rentsRouter);

app.use((err, req, res, next) => {
    console.log(err.message, err.stack);
    res.status(err.statusCode || 500).json({error: err.message});
    return;
})

// https.createServer(options, app).listen(
//     3000, () => console.log('The (Https) server is running on port 3000')
// )

app.listen(port, () => {
    console.log(`Szerver fut a http://localhost:${port} címen`);
});