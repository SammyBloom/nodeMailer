const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View Engine Setup
app.engine('handlebars', engine({
    layoutsDir: __dirname + "/views/layouts", extname: 'handlebars',
}));
app.set('view engine', 'handlebars');
// app.set('views', './views');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.render('main', {
    layout: 'contact',
   }); 
});


app.listen(3000, () => console.log('Server started...'));