import packageJson from '../../package.json';

const serviceName = 'core';
const serviceId = 'core';
const version: string = packageJson.version;
const environment = process.env.NODE_ENV ?? 'development';
const startupTime = new Date();

export { environment, serviceId, serviceName, startupTime, version };
