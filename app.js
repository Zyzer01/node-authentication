require('dotenv').config();
const express = require('express');
const md5 = require('md5')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const port = 3000;

const app = express();

app.use(express.static("public"));
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded(
    {extended:true}
));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new Schema({
    email: String,
    password: String
})


const User = model('User', userSchema);

app.get("/", (req, res) => {
    res.render('home.ejs');
})

app.get("/login", (req, res) => {
    res.render('login.ejs')
})

app.get("/register", (req, res) => {
    res.render('register.ejs')
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err) => {
        if(!err){ 
            res.render('secrets.ejs');
        } else{
            console.log(err);
        }
    })
});

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: email}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if (foundUser.password === password) {
                    res.render('secrets.ejs');
                }
            }
        }
    })
})

app.listen(port, (req, res) => {
    console.log(`App is running on port ${port}`);
})