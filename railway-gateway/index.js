import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs from environment or use Cloudflare Pages as fallback
const SERVICES = {
  'blackroad.systems': process.env.INTERNAL_SERVICES_URL || 'https://69af58d3.blackroad-systems.pages.dev',
  'blackroad.io': process.env.PRODUCT_SERVICES_URL || 'https://9424fbf9.blackroad-io.pages.dev',
  'blackroad.company': process.env.COMPANY_SERVICES_URL || 'https://d023f9a8.blackroad-company.pages.dev',
  'blackroad.me': process.env.PERSONAL_PORTAL_URL || 'https://8439c473.blackroad-me.pages.dev',
  'roadcoin.io': process.env.FINANCIAL_SERVICES_URL || 'https://3b0c6fd9.roadcoin-io.pages.dev',
  'roadchain.io': process.env.BLOCKCHAIN_SERVICES_URL || 'https://1a2b9883.roadchain-io.pages.dev',
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'blackroad-railway-gateway',
    project_id: 'ef287e60-efa9-432e-a3bc-f6df4c7a7b35',
    timestamp: new Date().toISOString(),
    domains: Object.keys(SERVICES),
    services: SERVICES
  });
});

// Main routing logic
app.use(async (req, res, next) => {
  const hostname = req.hostname || req.get('host')?.split(':')[0] || '';

  console.log(`[Gateway] Request: ${req.method} ${hostname}${req.path}`);

  // Extract root domain (last 2 parts)
  const parts = hostname.split('.');
  const rootDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
  const subdomain = parts.length > 2 ? parts[0] : '';

  // Get target service URL
  const targetService = SERVICES[rootDomain];

  if (!targetService) {
    return res.status(404).json({
      error: 'Domain not configured',
      hostname,
      rootDomain,
      subdomain,
      availableDomains: Object.keys(SERVICES)
    });
  }

  // For now, proxy to the Cloudflare Pages service
  // In production, you'd use http-proxy-middleware or similar
  const targetUrl = `${targetService}${req.path}`;

  console.log(`[Gateway] Routing ${hostname}${req.path} → ${targetUrl}`);

  // Simple redirect for now (replace with proper proxy in production)
  res.redirect(302, targetUrl);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 BlackRoad Railway Gateway`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 Handling ${Object.keys(SERVICES).length} domains:`);
  Object.entries(SERVICES).forEach(([domain, url]) => {
    console.log(`   • ${domain} → ${url}`);
  });
  console.log(``);
  console.log(`✅ Gateway ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
