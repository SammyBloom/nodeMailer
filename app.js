const express = require('express');
const bodyParser = require('body-parser');
const { engine }  = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { google } = require('googleapis');

const app = express();

// View Engine Setup
app.engine('handlebars', engine({
    layoutsDir: __dirname + "/views/layouts", extname: 'handlebars',
}));
app.set('view engine', 'handlebars');

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

app.post('/send', (req, res) => {

    const output = `
        <p>You have a new Contact Request!</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    const CLIENT_ID = process.env.OAUTH_CLIENTID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});

    try {
        const accessToken = oAuth2Client.getAccessToken();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        let mailOptions = {
            from: 'SammyBloom 😉 <nwachiemi@gmail.com>',
            to: 'samuelnwanwobi@gmail.com',
            subject:'Testing Nodemailer messages',
            text: 'Hi World',
            html: output
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err){
                console.log("Error "+ err);
            }else{
                console.log("Email sent successfully");
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
                res.render('main', {
                    layout: 'contact',
                }, {message: 'Email has been sent'});
            }
        });
    
    } catch (error) {
        return error;
    }

});

app.listen(3000, () => console.log('Server started...'));