//se importa mongoose para mongodb y se inicializa el módulo schema para hacer un model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//importar el tipo ObjectId para trabajar con ids
const ObjectId = Schema.ObjectId;


//se crea un schema del modelo
const TaskSchema = Schema({
   
    name:{
        //se crea un título de tipo cadena
        type: String,
        require: true
    },

    description: {
        //del mismo modo se crea la descripción
        type: String, 
        require: true
    },

    is_complete: {
        //se crea un campo para verificar si se ha completado la tarea
        type: Boolean,
        require: true,
        default: false //por defecto se asignará el valor false
    },

    date_created: {
        //se crea un campo para la fecha de creación
        type: Date,
        require: true,
        default: Date.now //por defecto llevará la fecha de creación en el momento
    },

    date_finish: {
        //se crea para definir la fecha de finalización de la tarea
        type: Date,
        require: true, 
        default: null
    }, 

    owner: {
        //se crea el campo propietario y se hace de tipo ObjectId
        type: ObjectId,
        require: true
    }
});

//se exporta el model añadiendo el nombre de la colección de MongoDB y el Schema
module.exports = mongoose.model("tasks", TaskSchema);