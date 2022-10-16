//importamos moment para las fechas
const moment = require('moment');

//importamos el servicio jwt
const jwt = require('../services/jwtService');

//crear una función (next es una función que continuará el proceso si todo va bien)
function secureRoute(request, response, next) {
    //si no recibimos el token por el apartado autorización del header
    if(!request.headers.authorization) {
        //damos error de autorización
        return response.status(403).send({msg: "Error authentication credentials are missing"});
    }

    //si tenemos la cabecera con el token lo guardamos
    const token = request.headers.authorization.replace(/['"]+/g, "");//reemplazamos las comillas simples por nada

    try {
        //decodificamos el token
        const payload = jwt.decodeToken(token, process.env.SECRET_KEY);

        //si el token ha caducado respondemos con error
        if(payload.exp <= moment().unix()){
            return response.status(400).send({msg: "Error: token has expired"});
        }
        //si todo va bien le pasamos el payload al usuario y avanzamos a la función next
        request.user = payload;
        next();
        
    }catch(error) {
        return response.status(404).send({msg: "Error: Invalid token"});
    }

}
    
//función getUser para recuperar usuarios
function getUser(request, response) {
    
    //recuperar token
    const token = request.headers.authorization.replace(/['"]+/g, "");

    //decodificar token
    const payload = jwt.decodeToken(token, process.env.SECRET_KEY);

    //retornar el payload
    return payload;

}

//exportar la función
module.exports = {
    secureRoute,
    getUser
}