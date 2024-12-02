const express = require('express');
const app = express();
const port = 3000;
const usersRouter = require('./routes/users');

app.use(express.json());

app.get('/', (req, res) => {
    res.json({"message": "OK, working!"})
});

app.use((err, req, res, next) => {
    console.log(err.message, err.stack);
    res.status(err.statusCode || 500).json({error: err.message});
    return;
})

app.listen(port, () => {
    console.log(`The server is running on this port: ${port}`);
});
