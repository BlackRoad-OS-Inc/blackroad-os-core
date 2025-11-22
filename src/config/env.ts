import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST ?? '0.0.0.0';

export { HOST, PORT };
