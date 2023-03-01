import Solicitud from "./Solicitud";

export default class Estudiante {

    id: Number
    solicitudes: Solicitud[]


    constructor(id: Number, solicitudes: Solicitud[]){
        this.id = id;
        this.solicitudes = solicitudes
    }
}