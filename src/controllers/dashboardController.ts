import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboardService';

class DashboardController {
  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const estadisticas = await dashboardService.obtenerEstadisticas(
        fechaInicio as string,
        fechaFin as string
      );
      res.status(200).json({
        status: 'success',
        data: estadisticas,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerVentasDelDia(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await dashboardService.obtenerVentasDelDia();
      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerVentasPorMes(req: Request, res: Response, next: NextFunction) {
    try {
      const { meses } = req.query;
      const cantidadMeses = meses ? parseInt(meses as string) : 6;
      const resultado = await dashboardService.obtenerVentasPorMes(cantidadMeses);
      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
