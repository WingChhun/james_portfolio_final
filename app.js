//require packages
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  xoauth2 = require('xoauth2');


//get and use packages
//so far - express,, body-parser,  nodemailer connect-flash -ejs

app.use(bodyParser.urlencoded({
  extended: true
})); // include bodyParser
app.use(express.static(__dirname + "/public"));
app.use(flash()); //use connect-flash
app.set("view engine", "ejs"); //default view engine is ejs

app.use(require("express-session")({
  secret: "James is the goat",
  resave: false,
  saveUninitialized: false

}));


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


/*
ROUTES
*/
/*
INDEX - Landing Page
-Render index.ejs, home page, bare bone simple

*/
console.log(process.env.GMAILPASSWORD);

app.get("/", function(req, res) {
  res.render("index"); //render index.ejs
});
/*
      CONTACT, will render a contact form to user, use nodemailer to send email to my personal email.
      */
app.get("/contact", function(req, res) {

  res.render("contact");
});
app.post('/contact', function(req, res) {



  console.log(req.body.mail);
  //NODEMAILER HANDLE CONTACT FORM and use flash to display errors.

  var sender = req.body.name + "<" + req.body.email + ">";

  var username = process.env.USER,

    client = process.env.CLIENTID,
    secret = process.env.CLIENTSECRET,
    refresh = process.env.REFRESHTOKEN,
    access = process.env.ACCESSTOKEN;


  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: "capt.wing.chhun@gmail.com",
      pass: process.env.GMAILPASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  //Content of mailn
  let HelperOptions = {
    form: req.body.name + "<" + req.body.email + ">",
    to: "capt.wing.chhun@gmail.com",
    subject: req.body.subject,
    text: req.body.message
  };
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error); //display error
      req.flash("error", "There was an error!");
      res.redirect("/contact");
    }
    console.log("The message was sent!"); //prompt success
    console.log(info); //show info in console of email
    req.flash("success", "Email successfully sent!");
    res.redirect("/contact");
  });


});





//Start server locally
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("server has started");
});
