var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

router.post('/', function (req, res, next) {

  User.findOne({email: req.body.email})
    .then(user => {
       return user ? true : false;
    })
    .then(foundUser => {
      if(foundUser){

        console.log("signup, user existing");
        
        const conflictError = 
          new Error(`The email ${req.body.email} ` +
                    `is already in use.`);
        conflictError.status = 409;
        throw conflictError;
      }

      console.log("signup, user not existing");

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
      });

      return user.save();
    })
    .then((saveResult) => {

      console.log("signup, user created");

      res.status(200).json({
        message: "User created",
        obj: saveResult
      });
    })
    .catch(error => {

      console.log("signup, caught error", error);

      if(error.status && error.status === 409) {

        console.log("signup, caught error error.status defined");

        res.status(error.status).json({
          title: "email already taken",
          error: {
            type: "NOTUNIQUE",
            message: error.message
          }
        });
      }
      else {

        console.log("signup, caught error error.status NOT defined",);

        res.status(500).json({
          title: "An error occured",
          error: error
        });
      }
    });
  
  // user.save().
  //   then((result) => {
  //     res.status(200).json({
  //       message: "User created",
  //       obj: result
  //     });
  //   })
  //   .catch(error => {
  //     res.status(500).json({
  //       title: "An error occured",
  //       error: error
  //     });
  //   })
});

router.post("/signin", function (req, res, next) {

  console.log("post signin called", req.body);

  User.findOne({
    email: req.body.email
  })
  .then((user) => {
    
    if(!user) {
      res.status(404).json({
        title: 'User not found',
        error: {
          type: "USER",
          message:
          `A user with email ${req.body.email} does not exist`
        }
      });
    }
    else {
      if(!bcrypt.compareSync(req.body.password, user.password)) {

        res.status(401).json({
          title: 'Invalid password',
          error: {
            type: 'PWD',
            message: 
              `The password given is invalid for the user ` +
              `with email ${req.body.email}.`
          }
        });
      }
      else {
        const token = jwt.sign(
          { user: user },
          'some-secret',
          { expiresIn: 7200 }
        );
        res.status(200).json({
          message: "Login Success",
          token: token,
          userId: user._id
        });
      }
    }
  })
  .catch((err) => {

    console.log("findOne error");
    console.log("error", err);

    res.status(500).json({
      title: "An error occured",
      error: err
    });
  })

});

module.exports = router;
