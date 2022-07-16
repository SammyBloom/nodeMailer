const express = require('express');
const bodyParser = require('body-parser');
const { ExpressHandlebars } = require('express-handlebars');
const exphbs = require(express-ExpressHandlebars);
const nodemailer = require('nodemailer');

const app = express();

app.get('/', (request, response) => {
   response.send('Hello'); 
});


app.listen(3000, () => console.log('Server started...'));