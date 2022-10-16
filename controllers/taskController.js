//cargar el model de tasks
const Task = require('../models/taskModel');
////////////////////////////////////////////////////////////////
//nueva función asíncrona para crear tareas
async function postTask (request, response) {
    //se crea un objeto del modelo
    const task = new Task();

    //recuperar los parámetros del body
    const params = request.body;

    //recuperar los datos del body y añadirlos al modelo
    task.name = params.name;
    task.description = params.description;

    //guardar datos
    try {
        //guardar resultados en la base de datos
        const taskStore = await task.save(); //el proceso será lineal hasta llegar al await (evita ejecutar todo a la vez)

        //revisar si no se ha guardado la tarea
        if (!taskStore) {
            response.status(400).send({msg: "Error: cannot create task"});
        } else {
            response.status(201).send({task: taskStore});
        }
    }catch (error) {
        //devolver error 500 si sale mal
        response.status(500).send(error);
        }
    }

////////////////////////////////////////////////////////////////////////////

//editar función para listar tareas, definir como asíncrona
async function getTasks(request, response) {
    try {
        //recuperar tareas de la base de datos
        //opcional: ordenar resultados con sort por un parámetro seleccionado.
        //agregar condición dentro de find.
        const tasks = await Task.find().sort({create_at: -1});

        //comprobar si hay tareas
        if (!tasks) {
            response.status(400).send({msg: "Error: Cannot get tasks"});
        } else {
            response.status(200).send(tasks);
        }

    }catch(error){
        response.status(500).send(error);
    }

}

//////////////////////////////////////////////////////////////////////////
//recuperar una sóla tarea
async function getTask(request, response) {
    //recuperar el id
    const taskId = request.params.id;

    try {
        //se hace un findById con el id recibido por el request
        const task = await Task.findById(taskId);

        if(!task){
            response.status(400).send({msg: "Error: Task doesn't exists"});
        }else {
            response.status(200).send(task);
        }
    }catch(error){
         response.status(500).send(error);
    }
}

/////////////////////////////////////////////////////////////////////////
//crear función (no asíncrona) para actualizar tareas
function putTask(request, response) {
    //recuperar el id
    const taskId = request.params.id;

    //recuperar parámetros a actualizar
    const params = request.body;

    try{
        //recuperar la tarea y ejecutar un callback
        Task.findById(taskId, (error, taskData) => {

            //comprobar si hay errores al recuperar tarea
            if (error) {
                response.status(500).send({msg: "Server status error"});
            } else {
                if(!taskData) {
                    response.status(400).send({msg: "Error: Task doesn't exists"});
                } else {
                        //recuperar parámetros a modificar
                        taskData.name = params.name;
                        taskData.description = params.description;

                        //si todo va bien, actualizar tarea y ejecutar un callback
                        Task.findByIdAndUpdate(taskId, taskData, (err, result) => {

                            if(err) {
                                response.status(404).send({msg: err});
                            } else if(!result) {
                                response.status(404).send({msg: "Error: task doesnt't exists"});
                            } else {
                                response.status(201).send({task: taskData});
                            }
                    });
                }
            }
        });
    } catch(error) {
        response.status(500).send(error);
    }
}


//////////////////////////////////////////////////////////////////////
//función para eliminar una tarea por su id
async function deleteTask(request, response) {
    //recuperar el id
    const taskId = request.params.id;

    try {
        //realizar delete
        const task = await Task.findByIdAndDelete(taskId);

        if(!task){
            response.status(400).send({msg: "Error: Task doesn't exists"});
        }else {
            response.status(200).send({msg: "Task succesfully deleted"});
        }
    }catch(error) {
        response.status(500).send(error);

        }
    }

////////////////////////////////////////////////////////////////////////
//cambiar el estado de la tarea
function changeTask(request, response) {
    //recuperar el id de la tarea
    const taskId = request.params.id;

    try {
        //buscar tarea a modificar y ejecutar callback
        Task.findById(taskId, (err, taskData) => {
            if(err) {
                response.status(500).send({msg: "Server status error"});
            }else {
                if(!taskData) {
                    response.status(400).send({msg:"Error: Task doesn't exists"});
                } else {
                    //si existe la tarea cambiar campos is_complete y date_finish
                    taskData.is_complete = true;
                    taskData.date_finish = Date.now();

                    //realizar cambios
                    Task.findByIdAndUpdate(taskId, taskData, (err, result) => {
                        if(err) {
                            response.status(404).send({msg: err});
                        }else if(!result){
                            response.status(404).send({msg: "Error: user doesn't exists"});
                        }else {
                            response.status(201).send({task: taskData});
                        }
                    });
                }
            }
        });

    }catch(error){
        response.status(500).send(error);
    }
}



//exportar el módulo getTasks
module.exports = {
    postTask, //exportar modulo nuevo
    getTasks,
    getTask,
    putTask,
    deleteTask,
    changeTask
};