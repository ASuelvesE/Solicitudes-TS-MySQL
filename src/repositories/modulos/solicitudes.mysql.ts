
import { executeQuery } from '../../db/mysql.connector'
import Documento from '../../models/Documento';
import Estado from '../../models/Estado';
import Estudiante from '../../models/Estudiante';

import Solicitud from '../../models/Solicitud';
import ISolicitudesRepository from './isolicitudes';


export default class SolicitudesRepositoryMySQL implements ISolicitudesRepository {

    async findAll(): Promise<Solicitud[]> {
        const sql: string = `select * FROM solicitudes`
        try {
            const data: Solicitud[] = await executeQuery<Solicitud[]>(sql)
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async findPendientes(): Promise<Solicitud[]> {
        const sql: string = `select * from solicitudes WHERE id NOT in(
            select solicitud
            from estados
            where  comentarios = "FINALIZADO"
        )`
        try {
            const data: Solicitud[] = await executeQuery<Solicitud[]>(sql)
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async findByTipos(): Promise<Solicitud[]> {
        const sql: string = `select count(*) as cantidad, tipo
        from solicitudes
        GROUP BY tipo`
        try {
            const data: Solicitud[] = await executeQuery<Solicitud[]>(sql)
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async findByIdCompleto(id: Number): Promise<Solicitud> {
        const sql: string = `select * from solicitudes WHERE id = ${id}`
        const sql2: string = `select * from documentos WHERE solicitud = ${id}`
        const sql3: string = `select * from estados WHERE solicitud = ${id} order by actualizacion desc`
        try {
            const solicitudesDB: any[] = await executeQuery<Solicitud[]>(sql);
            const documentosDB: any[] = await executeQuery<Solicitud[]>(sql2);
            const estadosDB: any[] = await executeQuery<Solicitud[]>(sql3);
            const documentos: Documento[] = [];
            const estados: Estado[] = [];

            for(let documento of documentosDB){
                documentos.push(new Documento(documento.id,documento.ruta))
            }
            for(let estado of estadosDB){
                estados.push(new Estado(estado.actualizacion,estado.comentarios));
            }
            const solicitud: Solicitud = new Solicitud(solicitudesDB[0].id,solicitudesDB[0].estudiante,solicitudesDB[0].tipo,documentos,estados);
            return solicitud;
        } catch (error) {
            console.error(error);
            return new Solicitud(0,undefined,"",[],[]);
        }
    }

    async save(solicitud: Solicitud): Promise<Solicitud> {
        const sql: string = `insert into solicitudes (estudiante,tipo) values (${solicitud.estudiante},'${solicitud.tipo}')`
        const sqlRes: string = `select * from solicitudes where estudiante = ${solicitud.estudiante} AND tipo = '${solicitud.tipo}' order by id desc`
        try {
            await executeQuery<Solicitud[]>(sql)
            const solicitudesDB : any = await executeQuery<Solicitud[]>(sqlRes);
            return new Solicitud(solicitudesDB[0].id,solicitudesDB[0].estudiante,solicitudesDB[0].tipo,[],[])
        } catch (error) {
            console.error(error);
            return new Solicitud(0,undefined,"",[],[]);
        }
    }
    async addDocument(ruta: String , idSolicitud: Number): Promise<Documento> {
        const sql: string = `insert into documentos (solicitud,ruta) values (${idSolicitud},'${ruta}')`
        const sql2: string = `select * from documentos where solicitud = ${idSolicitud} and ruta = '${ruta}' order by id desc`
        try {
            await executeQuery<Documento[]>(sql)
            const documentosDB : any = await executeQuery<Documento[]>(sql2);
            return new Documento(documentosDB[0].id,documentosDB[0].ruta);
        } catch (error) {
            console.error(error);
            return new Documento(0,"");
        }
    }
    async addEstado(comentarios: String, idSolicitud: Number): Promise<Estado> {
        let fechaActual: any = new Date();
        fechaActual = fechaActual.getUTCFullYear() + '-' +
            ('00' + (fechaActual.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + fechaActual.getUTCDate()).slice(-2) + ' ' + 
            ('00' + fechaActual.getUTCHours()).slice(-2) + ':' + 
            ('00' + fechaActual.getUTCMinutes()).slice(-2) + ':' + 
            ('00' + fechaActual.getUTCSeconds()).slice(-2);

        const sql: string = `insert into estados (solicitud,actualizacion,comentarios) values (${idSolicitud},'${fechaActual}','${comentarios}')`
        const sql2: string = `select * from estados where actualizacion = '${fechaActual}'`
        
        try {
            await executeQuery<Documento[]>(sql)
            const estadosDB : any = await executeQuery<Documento[]>(sql2);
            return new Estado(estadosDB[0].actualizacion,estadosDB[0].comentarios);
        } catch (error) {
            console.error(error);
            return new Estado(undefined,"");
        }
    }
    async saveCompleta(solicitud: Solicitud): Promise<Solicitud> {
        const sql: string = `insert into solicitudes (estudiante,tipo) values (${solicitud.estudiante},'${solicitud.tipo}')`
        
        const sqlRes: string = `select * from solicitudes where estudiante = ${solicitud.estudiante} AND tipo = '${solicitud.tipo}' order by id desc`
        try {
            await executeQuery<Solicitud[]>(sql) //Inserto en la tabla solicitudes 
            const solicitudesDB : any = await executeQuery<Solicitud[]>(sqlRes); //Recogo la solicitud con su id
            
            for(let documento of solicitud.documentos){
                await this.addDocument(documento.ruta,solicitudesDB[0].id) //Inserto en la tabla documentos
            }
            for(let estado of solicitud.estados){
                await this.addEstado(estado.comentarios,solicitudesDB[0].id)//Inserto en la tabla estados
            }

            return this.findByIdCompleto(solicitudesDB[0].id);
        } catch (error) {
            console.error(error);
            return new Solicitud(0,undefined,"",[],[]);
        }
    }
}
