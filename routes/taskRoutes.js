//Se importa y carga el enrutador de express
const express = require('express');
const api = express.Router();

const app = require('../app');

//importamos el controlador de tareas
const taskController = require("../controllers/taskController");

//importamos el middleware
const authMiddleware = require('../middlewares/authMiddleware');

//Se le pasa el controlador a la ruta.
//Añadimos ruta para listar y crear tareas
//Añadimos el middleware para securizar las rutas a todas las rutas
api.get("/tasks", [authMiddleware.secureRoute], taskController.getTasks);//añadir una tarea
api.post("/tasks", [authMiddleware.secureRoute], taskController.postTask);//listar todas las tareas
api.get("/tasks/:id", [authMiddleware.secureRoute], taskController.getTask);//listar una tarea
api.put("/tasks/:id", [authMiddleware.secureRoute], taskController.putTask);//modificar una tarea
api.delete("/tasks/:id", [authMiddleware.secureRoute], taskController.deleteTask);//eliminar una tarea
api.patch("/tasks/:id", [authMiddleware.secureRoute], taskController.changeTask);//actualizar tarea


//Se exporta el archivo de rutas
module.exports = api;