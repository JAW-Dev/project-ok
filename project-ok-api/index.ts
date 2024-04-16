import express from 'express';
require('dotenv').config();
const port = process.env.PORT;
const database = require('./routes/db');
const util = require('./routes/util');
const users = require('./routes/users');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.use('/util', util);
app.use('/db', database);
app.use('/users', users);

app.listen(port, () => {
	console.log(`server started on port ${port}`);
});
