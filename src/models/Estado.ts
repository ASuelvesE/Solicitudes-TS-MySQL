export default class Estado {

    actualizacion: Date | undefined
    comentarios: String

    constructor(actualizacion: Date | undefined,comentarios: String){
        this.actualizacion = actualizacion;
        this.comentarios = comentarios;
    }
}