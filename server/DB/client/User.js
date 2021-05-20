let mongoose = require("mongoose"),
    bcrypt = require("bcrypt-nodejs"),
    Schema = mongoose.Schema;

let UserSchema = new Schema({
    first_name: String,
    username: String,
    password: String,
    email: String,

    info: {
        age: String,
        dateRegister: String,
        city: String,
        verified: Boolean,
        sex: String,
    },
    numberPhone: String,
    image_user_profile: String,
    about: String,
    background_user_profile: String,

    banned: Boolean,
    bannedReason: String,

    favorites: Array,
    
    gallery: Array,
    
    suports: Array,
    purcashed: Array,

    shortcut:{
        id:Number,
        text:String
    },
    
    rules: String,
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = UserSchema;