import app from './index';
import { PORT } from './config/env';

const port = PORT || 8080;

app.listen(port, () => {
  console.log(`BlackRoad OS Core service listening on port ${port}`);
});
