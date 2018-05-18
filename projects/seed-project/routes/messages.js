var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

router.get("/", (req, res, next) => {
  Message.find()
    .populate('user', 'firstName')
    .exec((err, messages) => {
      if(err) {
        return res.status(500).json({
          title: "an error occured",
          error: err
        });
      }
      res.status(200).json({
        message: "Success",
        obj: messages
      })
    });
});

router.use('/', (req, res, next) => {

  jwt.verify(req.query.token, 'some-secret', (err, decoded) => {
    if(err) {

      console.log("jwt authorize error", err)

      res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }
    else {
      next();
    }
  });
});

router.post('/', (req, res, next) => {

  console.log("post: save message");

  const decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id)
    .then(user => {

      console.log("first", user);

      const message = new Message({
        content: req.body.content,
        user: user._id,
      });

      return new Promise((resolve, reject) => {
        message.save().then((messageSaved) => {
          resolve({message: messageSaved, user: user});
        })
        .catch(error => reject(error));
      });
    })
    .then(result => {

      console.log("second", result);

      result.user.messages.push(result.message);
      result.user.save();
      res.status(201).json({
        message: 'Saved message',
        obj: result.message,
        userName: result.user.firstName
      });
    })
    .catch(error => {

      console.log("post: save message", error);

      res.status(500).json({
        title: 'An error occured',
        error: error
      });
    });
});


router.patch("/:id", (req, res, next) => {

  const decoded = jwt.decode(req.query.token);
  console.log("decoded", decoded);
  const userId = decoded.user._id;

  Message.findById(req.params.id)
    .then((message) => {

      if(!message) {
        res.status(404).json({
          title: "No message",
          error: {
            message: `Message with id ${req.param.id} not found`}
        });
      }
      else {
        message.content = req.body.content;
        const messageUserId = message.user._id;

        console.log(userId, messageUserId);
        console.log(typeof userId);
        console.log(typeof messageUserId);

        if(userId != messageUserId) {
          res.status(401).json({
            title: "Error, not owner of message",
            error: {
              message:
                `You are not authorized to update the ` +
                `message with id ${message._id}.`
            }
          });
          return;
        }

        message.save()
          .then((result) => {
            res.status(200).json({
              message: "Success",
              obj: result
            });
          })
          .catch((err) => {
            res.status(500).json({
              title: "An error occured",
              error: err
            });
          });
      }
    })
    .catch(err => {
      return res.status(500).json({
        title: "An error occured",
        error: err
      });
    });
});

router.delete('/:id', (req, res, next) => {

  const decoded = jwt.decode(req.query.token);
  const userId = decoded.user._id;

  Message.findById(req.params.id)
    .then((message) => {

      if(!message) {
        res.status(404).json({
          title: "No message",
          error: {
            message:
              `Message with id ${req.param.id} not found`}
        });
      }
      else {
        
        const messageUserId = message.user._id;
        if(userId != messageUserId) {
          res.status(401).json({
            title: "Error, not owner of message",
            error: {
              message:
                `You are not authorized to delete the ` +
                `message with id ${message._id}.`
            }
          });
          return;
        }

        message.remove()
          .then((result) => {
            res.status(200).json({
              message: "Deleted message",
              obj: result
            });
          })
          .catch((err) => {
            res.status(500).json({
              title: "An error occured",
              error: err
            });
          });
      }
    })
    .catch(err => {
      return res.status(500).json({
        title: "An error occured",
        error: err
      });
    });  
});


module.exports = router; 