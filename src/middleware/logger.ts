import morgan from 'morgan';

// Formato personalizado de logs
morgan.token('body', (req: any) => JSON.stringify(req.body));

export const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);
