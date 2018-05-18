var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
  content: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});


schema.post('remove', (message) => {

  User.findById(message.user)
    .then(user => {
      user.messages.pull(message._id);
      user.save();
    })
    .catch(err => {
      console.log("schema post remove error", err);
    });
});

// schema.post('save', (message) => {

//   console.log("schema post save called", message);

//   User.findById(message.user)
//     .then(user => {

//       console.log("schema post save called then", user);

//       message.user.firstName = user.firstName;
//     })  
//     .catch(err => {
//       console.log("schema post save error", err);
//     });
// });



// const myPost = () => {
//   return new Promise((resolve, reject) => {
//     schema.post('remove', (message) => {
//       console.log("schema myPost success", message);
//       resolve(message);
//     });
//   });
// };

// myPost()
//   .then(message => {
//     return User.findById(message.user);
//   })
//   .then(user => {
//     user.messages.pull(message._id);
//     user.save();
//   })
//   .catch(err => {
//     console.log("schema post error", err);
//   }
// );


module.exports = mongoose.model('Message', schema);