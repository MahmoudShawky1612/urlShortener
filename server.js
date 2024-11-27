const express = require('express');
const app = express();
const connection = require('./db/connection');
const Url = require('./routes/url');
const auth = require('./routes/auth');
app.use(express.urlencoded({ extended: false }));
require('dotenv').config();
const port = 300;
app.use(express.json());


app.use('/api/v1/urls', Url);
app.use('/api/v1/auth', auth);



const connect = async () =>  {
    try {
        await connection(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (e) {
        console.error('Error starting server:', e);
    }
}


connect();
