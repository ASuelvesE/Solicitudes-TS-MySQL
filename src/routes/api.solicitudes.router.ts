import express, { Request, Response } from 'express'
import Documento from '../models/Documento';
import Estado from '../models/Estado';
import Solicitud from '../models/Solicitud';
import SolicitudesRepositoryMySQL from '../repositories/modulos/solicitudes.mysql';


const router = express.Router()

const ApiSolicitudesRepository = new SolicitudesRepositoryMySQL();

router.get('/', async (req: Request, res: Response) => {
    try {       
        const solicitudes = await ApiSolicitudesRepository.findAll();
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/pendientes', async (req: Request, res: Response) => {
    try {       
        const solicitudes = await ApiSolicitudesRepository.findPendientes();
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/tipos', async (req: Request, res: Response) => {
    try {       
        const solicitudes = await ApiSolicitudesRepository.findByTipos();
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/:id', async (req: Request, res: Response) => {
    try {       
        const solicitudes = await ApiSolicitudesRepository.findByIdCompleto(Number(req.params.id));
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.post('/', async (req: Request, res: Response) => {
    try {       
        const solicitudes = await ApiSolicitudesRepository.save(req.body)
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.put('/:id/documentacion', async (req: Request, res: Response) => {
    try {       
        const ruta = req.body.ruta;
        const idSolicitud = Number(req.params.id);
        const solicitudes = await ApiSolicitudesRepository.addDocument(ruta,idSolicitud);
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.put('/:id/estado', async (req: Request, res: Response) => {
    try {       
        const comentarios = req.body.comentarios;
        const idSolicitud = Number(req.params.id);
        const solicitudes = await ApiSolicitudesRepository.addEstado(comentarios,idSolicitud);
        res.send(solicitudes)
    }
    catch (error) {
        res.send(error)
    }
})
router.post('/completa', async (req: Request, res: Response) => {
    try {       
        const idEstudiante = Number(req.body.estudiante);
        const tipo = req.body.tipo;
        const documentos : Documento[] = [];
        const estados : Estado[] = [];
        for(let documento of req.body.documentos){
            documentos.push(new Documento(undefined,documento.ruta))
        }
        for(let estado of req.body.estados){
            estados.push(new Estado(undefined,estado.comentarios));
        }
        const solicitudRes = await ApiSolicitudesRepository.saveCompleta(new Solicitud(undefined,idEstudiante,tipo,documentos,estados));
        res.send(solicitudRes)
    }
    catch (error) {
        res.send(error)
    }
})

export { router as routerApiSolicitudes};