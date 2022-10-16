//Se importa y carga el enrutador de express
const express = require('express');
const api = express.Router();

//Se importan los controladores para cada ruta
const taskController = require("../controllers/taskController");

//Se le pasa el controlador a la ruta.
//Añadimos ruta para listar y crear tareas
api.get("/tasks", taskController.getTasks);//añadir una tarea
api.post("/tasks", taskController.postTask);//listar todas las tareas
api.get("/tasks/:id", taskController.getTask);//listar una tarea
api.put("/tasks/:id", taskController.putTask);//modificar una tarea
api.delete("/tasks/:id", taskController.deleteTask);//eliminar una tarea
api.patch("/tasks/:id", taskController.changeTask);//actualizar tarea


//Se exporta el archivo de rutas
module.exports = api;