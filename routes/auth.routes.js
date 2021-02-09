const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res, next)=> {
    res.render('auth/signup.hbs')
})

// Handle POST requests to /signup
// when the user submits the data in the sign up form, it will come here
router.post("/signup", (req, res, next) => {
    // we use req.body to grab data from the input form
     const {username, password} = req.body
    //console.log(req.body) // check if this is an empty object
    // if not use the length 


    //validate first
    // checking if the user has entered all three fields
    // we're missing one important step here
    if (!username.length || !password.length) {
        res.render('auth/signup', {msg: 'Please enter all fields'})
        return;
    }

     //validate password (special character, some numbers, min 6 length)
      let regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
     if (!regexPass.test(password)) {
        res.render('auth/signup', {msg: 'Password needs to have special chanracters, some numbers and be 6 characters aatleast'})
        return;
     }

     // NOTE: We have used the Sync methods here. 
     // creating a salt 
     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(password, salt);
     UserModel.create({username,  password: hash})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
});

module.exports = router;
