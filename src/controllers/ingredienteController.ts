import { Request, Response, NextFunction } from 'express';
import ingredienteService from '../services/ingredienteService';

class IngredienteController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const ingrediente = await ingredienteService.crearIngrediente(req.body);
      res.status(201).json({
        status: 'success',
        data: { ingrediente },
      });
    } catch (error) {
      next(error);
    }
  }

  async crearMultiples(req: Request, res: Response, next: NextFunction) {
    try {
      const ingredientes = await ingredienteService.crearMultiplesIngredientes(req.body);
      res.status(201).json({
        status: 'success',
        data: { ingredientes, total: ingredientes.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', orderBy = 'nombre' } = req.query;
      const resultado = await ingredienteService.listarIngredientes(
        parseInt(page as string),
        parseInt(limit as string),
        orderBy as string
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
      const ingrediente = await ingredienteService.obtenerIngredientePorId(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: 'success',
        data: { ingrediente },
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const ingrediente = await ingredienteService.actualizarIngrediente(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: 'success',
        data: { ingrediente },
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await ingredienteService.eliminarIngrediente(
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

export default new IngredienteController();
