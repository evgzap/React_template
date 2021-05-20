let mongoose = require('mongoose');

let Models={
    User: mongoose.model('User', require('./Client/User')),
}

exports.Models = Models