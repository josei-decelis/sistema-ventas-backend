import { Request, Response, NextFunction } from 'express';
import productoService from '../services/productoService';

class ProductoController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const producto = await productoService.crearProducto(req.body);
      res.status(201).json({
        status: 'success',
        data: { producto },
      });
    } catch (error) {
      next(error);
    }
  }

  async crearMultiples(req: Request, res: Response, next: NextFunction) {
    try {
      const productos = await productoService.crearMultiplesProductos(req.body);
      res.status(201).json({
        status: 'success',
        data: { productos, total: productos.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', activo } = req.query;
      const resultado = await productoService.listarProductos(
        parseInt(page as string),
        parseInt(limit as string),
        activo as string
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
      const producto = await productoService.obtenerProductoPorId(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: { producto },
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const producto = await productoService.actualizarProducto(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: 'success',
        data: { producto },
      });
    } catch (error) {
      next(error);
    }
  }

  async asignarIngredientes(req: Request, res: Response, next: NextFunction) {
    try {
      const { ingredientes } = req.body;
      const producto = await productoService.asignarIngredientes(
        parseInt(req.params.id),
        ingredientes
      );
      res.status(200).json({
        status: 'success',
        data: { producto },
      });
    } catch (error) {
      next(error);
    }
  }

  async modificarIngredientes(req: Request, res: Response, next: NextFunction) {
    try {
      const { ingredientes } = req.body;
      const producto = await productoService.modificarIngredientes(
        parseInt(req.params.id),
        ingredientes
      );
      res.status(200).json({
        status: 'success',
        data: { producto },
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerCostoEstimado(req: Request, res: Response, next: NextFunction) {
    try {
      const costoInfo = await productoService.obtenerCostoEstimado(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: costoInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await productoService.eliminarProducto(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductoController();
