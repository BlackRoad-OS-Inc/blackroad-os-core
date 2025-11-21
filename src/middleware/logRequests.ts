import { NextFunction, Request, Response } from 'express';

const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const roundedDuration = durationMs.toFixed(2);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${roundedDuration}ms`);
  });

  next();
};

export default logRequests;
