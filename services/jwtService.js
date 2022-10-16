//importar jwt
const jwt = require('jsonwebtoken');

//crear token
function createToken(user, expiresIn){
    //recuperamos el id y el email del objeto user
    const {id, email} = user;

    //y lo añadimos al payload
    const payload = {id, email}

    //utilizamos el payload para retornar el token tras iniciar sesión junto a la secret key de nuestras variables de entorno
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: expiresIn});
}

//crear una función para decodificar el token
function decodeToken(token) {
    return jwt.decode(token, process.env.SECRET_KEY);
}


//exportar las dos funciones para crear y decodificar token
module.exports = {
    createToken,
    decodeToken
}