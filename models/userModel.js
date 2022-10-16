const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema ({
    name: {
        type: String,
        require: false
    }, 

    lastname: {
        type: String,
        require: false
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    }
});

//se exporta el model añadiendo el nombre de la colección de MongoDB y el Schema
module.exports = mongoose.model('users', UserSchema);