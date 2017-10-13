//require packages
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  xoauth2 = require('xoauth2'),
  validator = require("email-validator"),
  empty = require("is-empty");



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


/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */

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
  var messageLength = req.body.message;
  validator.validate(req.body.email); // true
  //Check if email is valid
  if (!validator.validate(req.body.email) || empty(req.body.name) || empty(req.body.subject) ||
    empty(req.body.message) || empty(req.body.phone)) {
    console.log("One parameter was invalid");
    req.flash("error", "There was an error, please fill out all fields");
    return res.redirect("/contact");
  } else if (messageLength.length < 20) {
    //check if message is at least 30 characeters
    req.flash("error", "There was an error, message must be at least 20 characters!");
    return res.redirect("/contact");
  } else {
    //Proceed, send email, no parameter is blank, valid email as well.
    var sender = req.body.name + "<" + req.body.email + ">";

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: process.env.nodeMailer_EMAIL,
        pass: process.env.nodeMailer_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var sender = req.body.name,
      info = "Email Address: " + req.body.email + "\n\n Phone Number: " + req.body.phone + "\n\n Message: " + req.body.message;
    console.log(sender);
    //Content of mailn
    let HelperOptions = {
      from: sender,
      to: "capt.wing.chhun@gmail.com",
      subject: req.body.subject,
      text: info
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
  }

});





//Start server locally
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("server has started");
});
