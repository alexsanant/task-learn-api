//importar e inicializar express
const express = require('express');
const app = express();

//importar cors
const cors = require('cors');

//habilitar todas las peticiones cors
app.use(cors());

//para trabajar con json se carga el módulo json de express
app.use(express.json());
app.use(express.urlencoded({extended: true})); //es necesaria la codificación

//importar módulo de las task routes y de los user routes
const taskRoutes = require('./routes/taskRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

//crear punto de partida para las rutas de task y de user
app.use("/api", taskRoutes);
app.use("/api", userRoutes);

//exportamos app para index.js
module.exports = app;