import Estudiante from "../../models/Estudiante";


export default interface IEstudiantesRepository{
    findAll() : Promise<Estudiante[]>;

    save(estudiante: Estudiante) : Promise<Estudiante>;
}