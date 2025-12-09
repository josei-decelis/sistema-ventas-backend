import { Request, Response, NextFunction } from 'express';
import clienteService from '../services/clienteService';

class ClienteController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await clienteService.crearCliente(req.body);
      res.status(201).json({
        status: 'success',
        data: { cliente },
      });
    } catch (error) {
      next(error);
    }
  }

  async crearMultiples(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await clienteService.crearMultiplesClientes(req.body);
      res.status(201).json({
        status: 'success',
        data: { clientes, total: clientes.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', buscar = '' } = req.query;
      const resultado = await clienteService.listarClientes(
        parseInt(page as string),
        parseInt(limit as string),
        buscar as string
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
      const cliente = await clienteService.obtenerClientePorId(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: { cliente },
      });
    } catch (error) {
      next(error);
    }
  }

  async buscar(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          status: 'fail',
          message: 'Debe proporcionar un término de búsqueda',
        });
      }
      const clientes = await clienteService.buscarCliente(q as string);
      return res.status(200).json({
        status: 'success',
        data: { clientes },
      });
    } catch (error) {
      return next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await clienteService.actualizarCliente(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: 'success',
        data: { cliente },
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await clienteService.eliminarCliente(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerHistorialVentas(req: Request, res: Response, next: NextFunction) {
    try {
      const historial = await clienteService.obtenerHistorialVentas(parseInt(req.params.id));
      res.status(200).json({
        status: 'success',
        data: historial,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClienteController();
