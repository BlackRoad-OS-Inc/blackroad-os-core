import { Router } from 'express';
import { PORT } from '../config/env';
import { environment, serviceName, startupTime, version } from '../config/serviceConfig';

const systemRouter = Router();

systemRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: serviceName });
});

systemRouter.get('/info', (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startupTime.getTime()) / 1000);

  res.json({
    service: serviceName,
    version,
    environment,
    uptimeSeconds,
  });
});

systemRouter.get('/version', (_req, res) => {
  res.json({ service: serviceName, version });
});

systemRouter.get('/debug', (_req, res) => {
  const envSummary: Record<string, string> = {
    NODE_ENV: process.env.NODE_ENV ?? environment,
    PORT: process.env.PORT ?? PORT.toString(),
  };

  if (process.env.RAILWAY_ENVIRONMENT) {
    envSummary.RAILWAY_ENVIRONMENT = process.env.RAILWAY_ENVIRONMENT;
  }

  res.json({
    service: serviceName,
    envSummary,
  });
});

export default systemRouter;
