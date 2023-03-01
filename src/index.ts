import express from 'express';
import dotenv from "dotenv";

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

dotenv.config()

const app = express();
app.use(express.json())

const port = process.env.PORT


//routers

import { routerApiEstudiantes } from './routes/api.estudiantes.router'
import { routerApiSolicitudes } from './routes/api.solicitudes.router'


app.use('/estudiantes',routerApiEstudiantes)
app.use('/solicitudes',routerApiSolicitudes)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});