//se importa y carga el enrutador de express
const express = require('express');
const api = express.Router();

//Se importan los controladores para cada ruta
const userController = require('../controllers/userController');

//Se le pasa el controlador a la ruta.
//Añadimos ruta para listar y crear tareas
api.post("/register", userController.postUser);//añadir usuarios
api.post("/login", userController.login);//login
api.post("/forgot", userController.forgot);//enviar email
api.put("/reset/:id/:token", userController.resetPassword); //cambio de contraseña


module.exports = api;