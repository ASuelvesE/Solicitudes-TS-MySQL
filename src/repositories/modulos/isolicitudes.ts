

import Documento from "../../models/Documento";
import Estado from "../../models/Estado";
import Solicitud from "../../models/Solicitud";


export default interface ISolicitudesRepository{
    findAll() : Promise<Solicitud[]>;
    findPendientes() : Promise<Solicitud[]>;
    findByTipos() : Promise<Solicitud[]>;
    save(solicitud: Solicitud) : Promise<Solicitud>;
    findByIdCompleto(id: Number) : Promise<Solicitud>;
    addDocument(ruta: String , idSolicitud: Number) : Promise<Documento>;
    addEstado(comentarios: String , idSolicitud: Number) : Promise<Estado>;
    saveCompleta(solicitud: Solicitud) : Promise<Solicitud>;
}