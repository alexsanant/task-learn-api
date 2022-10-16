//importar el encriptador de contraseñas
const bcryptjs = require('bcryptjs');

//importamos el modelo user
const User = require('../models/userModel');

//importamos el servicio jwt
const jwt = require('../services/jwtService');

/////////////////////////////////////////////////////////////////////////////////
//Registro de usuarios
async function postUser(request, response) {
    const params = request.body;
    const user = new User(params);

    try {
        //comprobar los campos y email y password
        if(!params.email) throw{msg: "Error: email cannot be null"};
        if(!params.password) throw{msg: "Error: password cannot be null"};
    

    //revisar si el email esta en uso
    const emailExists = await User.findOne({email: params.email});
    if(emailExists) throw {msg: "Error Email already exists"};

    //configurar el salt de bcrypt
    const salt = bcryptjs.genSaltSync(10);

    //cifrar la contraseña
    user.password = await bcryptjs.hash(params.password, salt);

    user.save();
    response.status(201).send({user:user});


} catch (error) {
    response.status(500).send(error);
    }

}


////////////////////////////////////////////////////////////////////////

//crear función para hacer login
async function login(request, response) {
    //recuperar el email y el password del body
    const {email, password} = request.body;

    try {
        //buscamos si existe el usuario por su email haciendo un  callback asíncrono
        User.findOne({email: email}, async (err, userData) => {
            //si el usuario no existe se lanza un mensaje de error
            if(err) {
                response.status(500).send({msg: "Server status error"});
            }else {
                if(!userData) {
                    response.status(400).send({msg: "Error: email doesn't exists"});
                }else {
                    //comprobar la contraseña recibida con la contraseña encriptada
                    const passwordCorrect = await bcryptjs.compare(password, userData.password);

                    //si la contraseña no es correcta avisar
                    if(!passwordCorrect) {
                        response.status(403).send({msg: "Error: incorrect password"});
                    } else {
                        //creamos el token que lleva el usuario la fecha de expiración del token (12 horas)
                        token = await jwt.createToken(userData, "24h");

                        //se responde con el token
                        response.status(200).send({token: token});
                    }
                }
            }
        });

    }catch(error) {
        request.status(500).send(error);
    }
}


module.exports = {
    postUser,
    login
}