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

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request!</p>
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

    async function main() {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'nwachiemi@gmail.com', // generated ethereal user
                pass: 'Farawayland_12', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"SammyBloom 👻" <nwachiemi@gmail.com>', // sender address
            to: "samuelnwanwobi@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render('main', {
            layout: 'contact',
        }, {message: 'Email has been sent'});

        main().catch(console.error);
    }

});


app.listen(3000, () => console.log('Server started...'));