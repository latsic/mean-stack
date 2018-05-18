var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {

    res.render('index');

    // User.findOne({})
    //     .then(doc => {
    //         res.render('node', {email: doc.email});
    //     })
    //     .catch(err => {
    //         res.send("Error!");
    //     });

    // User.findOne({}, (err, doc) => {
    //     if(err) {
    //         return res.send("Error!");
    //     }
    //     res.render('node', {email: doc.email});
    // });
});
// router.post('/', function(req, resp, next) {

//     const email = req.body.email;
//     const user = new User({
//         firstName: 'Lat',
//         lastName: 'Sic',
//         password: 'super-secret',
//         email: email
//     });

//     user.save()
//         .then(result => {
//             console.log("user.save() error", result);
//         })
//         .catch(err => {
//             console.log("user.save() success", err);
//         });

//     // user.save((err, result) => {
//     //     if(err) {
//     //         console.log("user.save() error", err);
//     //     }
//     //     else{
//     //         console.log("user.save() success", result);
//     //     }
//     // });
//     resp.redirect('/');

    
//})

module.exports = router;
