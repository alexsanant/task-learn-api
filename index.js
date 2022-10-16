//Este será el archivo de entrada

//importa la constante app con express
const { default: mongoose } = require('mongoose');
const app = require('./app');

//cargar el puerto en una variable
const port = 10000;

//conectar mongoose a mongodb. En la ruta de la base de datos el /task-learn, crear una nueva base de datos con dicho nombre
//mongoose.connect("mongodb+srv://alex:1234@cluster0.ztiwq.mongodb.net/task_learn?retryWrites=true", (error, response) => {
mongoose.connect("mongodb+srv://alex:1234@cluster0.ztiwq.mongodb.net/task_learn", (error, response) => {   
    //trabajar con try / catch por si la url no estuviese bien definida
    try {
        if (error) {
            throw error; 
        } else {
            //si todo va bien avisamos por consola
            console.log("Se ha establecido la conexión a la base de datos");
        }
        
    }catch(error) {
            console.error(error);
            console.log("Imposible conectar");
        }
    
});


//lanzar el escuchador con un mensjae para saber que funciona
app.listen(port, () => {
    console.log(`Servidor funcionando en: http://localhost:${port}`);
});