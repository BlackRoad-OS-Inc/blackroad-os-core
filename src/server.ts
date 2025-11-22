import app from './index';
import { HOST, PORT } from './config/env';
import { environment, serviceName } from './config/serviceConfig';

app.listen(PORT, HOST, () => {
  console.log(
    `[startup] service=${serviceName} env=${environment} listening on ${HOST}:${PORT}`,
  );
});
