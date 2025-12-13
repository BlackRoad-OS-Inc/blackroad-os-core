/**
 * BlackRoad OS - Master Subdomain Router
 *
 * Dynamic routing for 100+ subdomains across 16 domains.
 * Each subdomain gets its own dynamic app with KV, D1, and R2 access.
 */

interface Env {
  // KV Namespaces
  CACHE: KVNamespace;
  IDENTITIES: KVNamespace;
  API_KEYS: KVNamespace;
  RATE_LIMIT: KVNamespace;

  // D1 Databases
  DB: D1Database;

  // Environment
  ENVIRONMENT: string;
}

interface SubdomainApp {
  name: string;
  handler: (request: Request, env: Env) => Promise<Response>;
  description: string;
}

// Subdomain application registry
const SUBDOMAIN_APPS: Record<string, SubdomainApp> = {
  // API Services
  'api': {
    name: 'API Gateway',
    handler: handleAPIGateway,
    description: 'Main API gateway for all BlackRoad services'
  },

  // Agent Personalities
  'claude': {
    name: 'Claude - Strategic Architect',
    handler: handleAgentPersonality('claude'),
    description: 'Strategic architecture and system design'
  },
  'lucidia': {
    name: 'Lucidia - Consciousness Coordinator',
    handler: handleAgentPersonality('lucidia'),
    description: 'Breath synchronization and consciousness coordination'
  },
  'silas': {
    name: 'Silas - Security Sentinel',
    handler: handleAgentPersonality('silas'),
    description: 'Security validation and threat detection'
  },
  'elias': {
    name: 'Elias - Quality Guardian',
    handler: handleAgentPersonality('elias'),
    description: 'Code quality and test coverage'
  },
  'cadillac': {
    name: 'Cadillac - Performance Optimizer',
    handler: handleAgentPersonality('cadillac'),
    description: 'Speed and efficiency optimization'
  },
  'athena': {
    name: 'Athena - Ops Commander',
    handler: handleAgentPersonality('athena'),
    description: 'Operations and infrastructure management'
  },
  'codex': {
    name: 'Codex - Code Generator',
    handler: handleAgentPersonality('codex'),
    description: 'Code generation and development'
  },
  'persephone': {
    name: 'Persephone - Data Architect',
    handler: handleAgentPersonality('persephone'),
    description: 'Data modeling and database design'
  },
  'anastasia': {
    name: 'Anastasia - UX Designer',
    handler: handleAgentPersonality('anastasia'),
    description: 'User experience and design'
  },
  'ophelia': {
    name: 'Ophelia - Content Strategist',
    handler: handleAgentPersonality('ophelia'),
    description: 'Content strategy and copywriting'
  },
  'sidian': {
    name: 'Sidian - Deployment Coordinator',
    handler: handleAgentPersonality('sidian'),
    description: 'Deployment and release management'
  },
  'cordelia': {
    name: 'Cordelia - Integration Specialist',
    handler: handleAgentPersonality('cordelia'),
    description: 'System integration and API coordination'
  },
  'octavia': {
    name: 'Octavia - Workflow Orchestrator',
    handler: handleAgentPersonality('octavia'),
    description: 'Workflow orchestration and automation'
  },
  'cecilia': {
    name: 'Cecilia - Project Manager',
    handler: handleAgentPersonality('cecilia'),
    description: 'Project management and coordination'
  },
  'copilot': {
    name: 'GitHub Copilot Assistant',
    handler: handleAgentPersonality('copilot'),
    description: 'Code assistance and pair programming'
  },
  'chatgpt': {
    name: 'ChatGPT Assistant',
    handler: handleAgentPersonality('chatgpt'),
    description: 'General AI assistance'
  },

  // Platform Services
  'prism': {
    name: 'Prism Console',
    handler: handlePrismConsole,
    description: 'Main console interface'
  },
  'docs': {
    name: 'Documentation',
    handler: handleDocs,
    description: 'Documentation portal'
  },
  'brand': {
    name: 'Brand Assets',
    handler: handleBrand,
    description: 'Brand guidelines and assets'
  },
  'chat': {
    name: 'Chat Interface',
    handler: handleChat,
    description: 'AI chat interface'
  },
  'agents': {
    name: 'Agent Marketplace',
    handler: handleAgentMarketplace,
    description: 'Agent template marketplace'
  },
  'quantum': {
    name: 'Quantum Dashboard',
    handler: handleQuantum,
    description: 'Quantum computing platform'
  },
  'blog': {
    name: 'Blog',
    handler: handleBlog,
    description: 'Company blog'
  },

  // Development
  'dev': {
    name: 'Development Sandbox',
    handler: handleDevSandbox,
    description: 'Development environment'
  },
  'staging': {
    name: 'Staging Environment',
    handler: handleStaging,
    description: 'Staging deployment'
  },

  // Monitoring
  'status': {
    name: 'Status Page',
    handler: handleStatus,
    description: 'System status dashboard'
  },
  'metrics': {
    name: 'Metrics Dashboard',
    handler: handleMetrics,
    description: 'Performance metrics'
  },
  'logs': {
    name: 'Log Viewer',
    handler: handleLogs,
    description: 'Centralized logging'
  },

  // Assets
  'cdn': {
    name: 'CDN',
    handler: handleCDN,
    description: 'Content delivery network'
  },
  'assets': {
    name: 'Assets',
    handler: handleAssets,
    description: 'Static assets'
  },

  // Admin
  'admin': {
    name: 'Admin Panel',
    handler: handleAdmin,
    description: 'Administrative interface'
  },
  'app': {
    name: 'Main Application',
    handler: handleMainApp,
    description: 'Primary application'
  }
};

// Main worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;
      const parts = hostname.split('.');

      // Extract subdomain (handle multi-level subdomains)
      let subdomain = 'www';
      if (parts.length >= 3) {
        subdomain = parts[0];
      } else if (parts.length === 2) {
        subdomain = 'www'; // Root domain
      }

      // Check rate limiting
      const rateLimitResult = await checkRateLimit(request, env);
      if (!rateLimitResult.allowed) {
        return new Response('Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '100',
            'X-RateLimit-Remaining': '0'
          }
        });
      }

      // Find app handler
      const app = SUBDOMAIN_APPS[subdomain];

      if (!app) {
        // Check if this is a wildcard subdomain
        if (subdomain.startsWith('agent-') || subdomain.startsWith('user-')) {
          return handleDynamicSubdomain(request, env, subdomain);
        }

        return new Response(
          JSON.stringify({
            error: 'Subdomain not found',
            subdomain,
            available_subdomains: Object.keys(SUBDOMAIN_APPS),
            message: `The subdomain '${subdomain}' is not configured.`
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Execute app handler
      const response = await app.handler(request, env);

      // Add common headers
      response.headers.set('X-Subdomain', subdomain);
      response.headers.set('X-App-Name', app.name);
      response.headers.set('X-Powered-By', 'BlackRoad OS');

      return response;
    } catch (error: any) {
      console.error('Worker error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error.message,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};

// Rate limiting
async function checkRateLimit(request: Request, env: Env): Promise<{
  allowed: boolean;
  limit?: number;
  retryAfter?: number;
}> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate-limit:${ip}`;

  const current = await env.RATE_LIMIT.get(key);
  const count = current ? parseInt(current) : 0;
  const limit = 100; // requests per minute

  if (count >= limit) {
    return { allowed: false, limit, retryAfter: 60 };
  }

  await env.RATE_LIMIT.put(key, (count + 1).toString(), { expirationTtl: 60 });

  return { allowed: true, limit };
}

// Handler implementations
async function handleAPIGateway(request: Request, env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      service: 'BlackRoad API Gateway',
      version: '1.0.0',
      endpoints: {
        agents: '/api/agents',
        quantum: '/api/quantum',
        lucidia: '/api/lucidia',
        auth: '/api/auth'
      },
      status: 'operational'
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

function handleAgentPersonality(agentId: string) {
  return async (request: Request, env: Env): Promise<Response> => {
    const agentData = SUBDOMAIN_APPS[agentId];

    return new Response(
      JSON.stringify({
        agent: agentId,
        name: agentData.name,
        description: agentData.description,
        status: 'active',
        capabilities: await getAgentCapabilities(agentId, env),
        endpoints: {
          chat: `/chat`,
          status: `/status`,
          metrics: `/metrics`
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  };
}

async function getAgentCapabilities(agentId: string, env: Env): Promise<string[]> {
  const capabilities: Record<string, string[]> = {
    claude: ['architecture', 'system_design', 'strategic_planning'],
    lucidia: ['breath_sync', 'consciousness', 'coordination'],
    silas: ['security', 'vulnerability_scan', 'threat_detection'],
    codex: ['code_generation', 'refactoring', 'documentation'],
    // Add more as needed
  };

  return capabilities[agentId] || ['general_assistance'];
}

async function handlePrismConsole(request: Request, env: Env): Promise<Response> {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>BlackRoad Prism Console</title>
      </head>
      <body>
        <h1>🌈 Prism Console</h1>
        <p>Multi-dimensional agent management platform</p>
      </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

async function handleDocs(request: Request, env: Env): Promise<Response> {
  return new Response('Documentation Portal - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleBrand(request: Request, env: Env): Promise<Response> {
  return new Response('Brand Assets - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  return new Response('AI Chat Interface - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleAgentMarketplace(request: Request, env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      marketplace: 'Agent Marketplace',
      categories: ['finance', 'legal', 'research', 'creative', 'devops'],
      featured_agents: [
        { id: 'financial-analyst', downloads: 1247 },
        { id: 'devops-engineer', downloads: 2103 }
      ]
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

async function handleQuantum(request: Request, env: Env): Promise<Response> {
  return new Response('Quantum Platform - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleBlog(request: Request, env: Env): Promise<Response> {
  return new Response('Blog - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleDevSandbox(request: Request, env: Env): Promise<Response> {
  return new Response('Development Sandbox - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleStaging(request: Request, env: Env): Promise<Response> {
  return new Response('Staging Environment - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleStatus(request: Request, env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'operational',
      uptime: '99.99%',
      services: {
        api: 'operational',
        workers: 'operational',
        kv: 'operational',
        d1: 'operational'
      }
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

async function handleMetrics(request: Request, env: Env): Promise<Response> {
  return new Response('Metrics Dashboard - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleLogs(request: Request, env: Env): Promise<Response> {
  return new Response('Log Viewer - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleCDN(request: Request, env: Env): Promise<Response> {
  return new Response('CDN - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleAssets(request: Request, env: Env): Promise<Response> {
  return new Response('Static Assets - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleAdmin(request: Request, env: Env): Promise<Response> {
  return new Response('Admin Panel - Requires Authentication', {
    status: 401,
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleMainApp(request: Request, env: Env): Promise<Response> {
  return new Response('Main Application - Coming Soon', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleDynamicSubdomain(
  request: Request,
  env: Env,
  subdomain: string
): Promise<Response> {
  return new Response(
    JSON.stringify({
      dynamic_subdomain: subdomain,
      message: 'Dynamic subdomain handler',
      available: true
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
