const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
require('dotenv').config();


const usersRouter = require('./routes/users');
const placesRouter = require('./routes/places');
const rentsRouter = require('./routes/rents');

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
app.use(cors(corsOptions));

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

