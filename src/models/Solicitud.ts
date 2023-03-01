import Documento from "./Documento";
import Estado from "./Estado";

export default class Solicitud {

    id: Number | undefined
    estudiante: Number | undefined
    tipo: String
    documentos: Documento[]
    estados: Estado[]


    constructor(id: Number | undefined, estudiante: Number | undefined,tipo: String,documentos: Documento[],estados: Estado[]){
        this.id = id;
        this.tipo = tipo;
        this.documentos = documentos;
        this.estados = estados;
        this.estudiante = estudiante;
    }
}