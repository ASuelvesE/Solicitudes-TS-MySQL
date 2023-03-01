export default class Documento {

    id: Number | undefined
    ruta: String

    constructor(id: Number | undefined,ruta: String){
        this.id = id;
        this.ruta = ruta;
    }
}