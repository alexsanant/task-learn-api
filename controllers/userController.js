//importar el encriptador de contraseñas
const bcryptjs = require('bcryptjs');

//importamos el modelo user
const User = require('../models/userModel');

//importamos el servicio jwt
const jwt = require('../services/jwtService');

//importamos el módulo nodemailer
const nodemailer = require('nodemailer');
const moment = require('moment');

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

//////////////////////////////////////////////////////////////
//crear función para recuperar password
function forgot(request, response) {
    //recibir parámetros
    const email = request.body.email;

    //si no llega el email por parámetros dará error
    if (!email) throw {MSG: "Error: email cannot be null"}

    try {
        //recuperar usuario
        User.findOne({email: email}, async (err, userData) => {
            if(err){
                response.status(500).send({msg: "Server status error"});
            }else {
                if(!userData){
                    response.status(400).send({msg: "Error: email doesn't exists"});
                } else {
                    //crear un token para 1 hora
                    token = await jwt.createToken(userData, "1h");

                    //preparar el email (ver info en en inbox de mailtrap.io)
                    var transport = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST,
                        port: 2525,
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS

                        }
                    });

                    //preparar las opciones del correo
                    const mailOptions = {
                        //mailtrap no nos da ninguna dirección, así que usaremos aquella con la que nos registramos
                        from : 'alexsanant@gmail.com',
                        to: userData.email,
                        subject: 'Restablecer contraseña | Task Learn',
                        //ruta del frontend para resetear password
                        text: `Restablezca su contraseña - http://localhost:3000/reset/${userData.id}/${token}` //ruta del frontend
                    };

                    //enviar email
                    transport.sendMail(mailOptions, (err, response) => {
                        if(err) {
                            response.status(500).send({msg: "Server status error"});
                        } else {
                            response.status(200).send({msg: "Email has send"});
                        }
                    });
                }
            }
        });

    }catch(error) {
        request.status(500).send(error);
    }
}

///////////////////////////////////////////////////////////////////////////////
async function resetPassword (request, response) {
    //recuperar el id y el token de usuario
    const {id, token} = request. params;

    //recuperamos la contraseña por partida doble
    const {newPassword, repitePassword} = request.body;

    //decodificar el token
    const user_token = jwt.decodeToken(token, process.env.SECRET_KEY);

    //comprobar si las contraseñas son diferentes o el token ha caducado o el 
    //id son distintos
    if(user_token.exp <= moment().unix()){
        response.status(400).send({msg: "Error: token has expired"});
    } else if(user_token.id !== id || newPassword !== repitePassword) {
        response.status(403).send({msg: "Error: unauthorized request"});
    }else {
        //codificar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        const password = await bcryptjs.hash(newPassword, salt);

        //actualizar contraseña nueva
        User.findByIdAndUpdate(id, {password: password}, (err, result) => {
            if(err) {
                response.status(500).send({msg: "Server status error"});
            }else if(!result) {
                response.status(404).send({msg: "Error: user doesn't exists"});
            }else {
                response.status(200).send({msg: "Password change succesfully"});
            }
        });
    }
}

module.exports = {
    postUser,
    login,
    forgot, 
    resetPassword
}