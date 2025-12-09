import { Request, Response, NextFunction } from 'express';
import metodoPagoService from '../services/metodoPagoService';

class MetodoPagoController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const metodoPago = await metodoPagoService.crearMetodoPago(req.body);
      res.status(201).json({
        status: 'success',
        data: { metodoPago },
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const metodosPago = await metodoPagoService.listarMetodosPago();
      res.status(200).json({
        status: 'success',
        data: { metodosPago },
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const metodoPago = await metodoPagoService.obtenerMetodoPagoPorId(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: 'success',
        data: { metodoPago },
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const metodoPago = await metodoPagoService.actualizarMetodoPago(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: 'success',
        data: { metodoPago },
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await metodoPagoService.eliminarMetodoPago(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MetodoPagoController();
