const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser")

const cors = require('cors');
require('dotenv').config();


const usersRouter = require('./routers/users');
const placesRouter = require('./routers/places');
const rentsRouter = require('./routers/rents');

app.use(express.json());

app.use(cors(
    {origin:["http://localhost:4200", "https://localhost:4200"],
     credentials:true   
    }))

app.use(cookieParser());

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

app.listen(port, () => {
    console.log(`The server is running on this port: ${port}`);
});