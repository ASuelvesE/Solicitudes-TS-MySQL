import express, { Request, Response } from 'express'
import Estudiante from '../models/Estudiante';
import EstudiantesRepositoryMySQL from '../repositories/estudiantes/estudiantes.mysql';


const router = express.Router()

const ApiEstudiantesRepository = new EstudiantesRepositoryMySQL();

router.get('/', async (req: Request, res: Response) => {
    try {      
        const estudiantes: Estudiante[] = await ApiEstudiantesRepository.findAll();
       res.send(estudiantes)
    }
    catch (error) {
        res.send(error)
    }
})


export { router as routerApiEstudiantes};