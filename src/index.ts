import express from 'express';
import ledgerRouter from './routes/ledger';
import systemRouter from './routes/systemRoutes';
import { PORT } from './config/env';

const app = express();

app.use(express.json());

app.use(systemRouter);
app.use('/ledger', ledgerRouter);

app.set('port', PORT);

export default app;
