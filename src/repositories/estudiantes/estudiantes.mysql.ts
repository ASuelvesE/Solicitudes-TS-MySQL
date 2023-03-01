
import { executeQuery } from '../../db/mysql.connector'
import Estudiante from '../../models/Estudiante';

import IEstudiantesRepository from './Iestudiantes';


export default class EstudiantesRepositoryMySQL implements IEstudiantesRepository {

    async findAll(): Promise<Estudiante[]> {
        const sql: string = `select * FROM estudiantes`
        try {
            const data: Estudiante[] = await executeQuery<Estudiante[]>(sql)
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    
    async save(estudiante: Estudiante): Promise<Estudiante> {
        const sql: string = `insert into estudiantes (nombre) values ("${estudiante.id}")`
        try {
            await executeQuery<Estudiante[]>(sql)
            return new Estudiante(0,[]);
        } catch (error) {
            console.error(error);
            return new Estudiante(0,[]);
        }
    }
}
