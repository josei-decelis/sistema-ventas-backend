import { Request, Response, NextFunction } from 'express';
import ventaService from '../services/ventaService';

class VentaController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const venta = await ventaService.crearVenta(req.body);
      res.status(201).json({
        status: 'success',
        data: { venta },
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = '1',
        limit = '10',
        fechaInicio,
        fechaFin,
        clienteId,
        metodoPagoId,
        estado,
      } = req.query;

      const resultado = await ventaService.listarVentas(
        parseInt(page as string),
        parseInt(limit as string),
        fechaInicio as string,
        fechaFin as string,
        clienteId ? parseInt(clienteId as string) : undefined,
        metodoPagoId ? parseInt(metodoPagoId as string) : undefined,
        estado as string
      );

      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const venta = await ventaService.obtenerVentaPorId(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: { venta },
      });
    } catch (error) {
      next(error);
    }
  }

  async anular(req: Request, res: Response, next: NextFunction) {
    try {
      const venta = await ventaService.anularVenta(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: { venta },
      });
    } catch (error) {
      next(error);
    }
  }

  async crearMultiples(req: Request, res: Response, next: NextFunction) {
    try {
      const resultados = await ventaService.crearMultiplesVentas(req.body);
      res.status(201).json({
        status: 'success',
        data: resultados,
        message: `${resultados.exitosas.length} ventas creadas, ${resultados.fallidas.length} fallidas`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VentaController();
