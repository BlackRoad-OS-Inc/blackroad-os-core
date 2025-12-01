-- BlackRoad OS Database Schema v1
-- Initial migration for 30K-agent infrastructure
-- Created: 2025-11-30

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations (tenants)
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orgs_slug ON orgs(slug);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- Org membership
CREATE TABLE org_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, user_id)
);

CREATE INDEX idx_org_users_org ON org_users(org_id);
CREATE INDEX idx_org_users_user ON org_users(user_id);

-- ============================================
-- PACK & AGENT TEMPLATE TABLES
-- ============================================

-- Packs (global, define groups of agents)
CREATE TABLE packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,               -- 'finance', 'edu', 'creator_studio'
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    version TEXT NOT NULL DEFAULT '1.0.0',
    manifest JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_packs_key ON packs(key);

-- Agent templates (global, defined by packs)
CREATE TABLE agent_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
    template_key TEXT NOT NULL,             -- 'invoice_categorizer'
    name TEXT NOT NULL,
    description TEXT,
    runtime_type TEXT NOT NULL,             -- 'llm_brain', 'workflow_engine', 'python_script'
    manifest JSONB NOT NULL,                -- base manifest from pack repo
    version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(pack_id, template_key)
);

CREATE INDEX idx_agent_templates_pack ON agent_templates(pack_id);
CREATE INDEX idx_agent_templates_key ON agent_templates(template_key);

-- Pack installations (which org has which pack)
CREATE TABLE pack_installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
    installed_version TEXT NOT NULL,
    settings JSONB DEFAULT '{}',
    installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, pack_id)
);

CREATE INDEX idx_pack_installations_org ON pack_installations(org_id);

-- ============================================
-- AGENTS (PER-ORG INSTANCES)
-- ============================================

-- Agents (per-org, instantiated from templates)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ps_sha_id TEXT UNIQUE NOT NULL,         -- PS-SHA-infinity ID
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    agent_template_id UUID REFERENCES agent_templates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    runtime_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'paused', 'error', 'archived'
    effective_manifest JSONB NOT NULL,      -- merged template + org overrides
    config JSONB DEFAULT '{}',              -- org-specific configuration
    parent_ps_sha_id TEXT,                  -- for versioning/lineage
    error_message TEXT,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agents_org ON agents(org_id);
CREATE INDEX idx_agents_ps_sha ON agents(ps_sha_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_template ON agents(agent_template_id);
CREATE INDEX idx_agents_parent ON agents(parent_ps_sha_id);

-- ============================================
-- JOBS & EXECUTION
-- ============================================

-- Jobs (work items for agents)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    trace_id TEXT NOT NULL,                 -- distributed tracing ID
    status TEXT NOT NULL DEFAULT 'queued',  -- 'queued', 'running', 'succeeded', 'failed', 'cancelled'
    priority INT NOT NULL DEFAULT 0,        -- higher = more urgent
    input JSONB,
    output JSONB,
    error TEXT,
    metadata JSONB DEFAULT '{}',
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    timeout_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_org ON jobs(org_id);
CREATE INDEX idx_jobs_agent ON jobs(agent_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_trace ON jobs(trace_id);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);

-- Job events (detailed audit trail)
CREATE TABLE job_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,               -- 'queued', 'started', 'progress', 'completed', 'failed', 'retried'
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_events_job ON job_events(job_id);
CREATE INDEX idx_job_events_type ON job_events(event_type);

-- ============================================
-- WORKER POOLS
-- ============================================

-- Worker pools (for autoscaling)
CREATE TABLE worker_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,              -- 'finance-default', 'edu-lowprio'
    pack_id UUID REFERENCES packs(id) ON DELETE SET NULL,
    queue_name TEXT NOT NULL,               -- Redis stream name, e.g. 'jobs.finance.default'
    min_workers INT NOT NULL DEFAULT 1,
    max_workers INT NOT NULL DEFAULT 10,
    target_latency_ms INT NOT NULL DEFAULT 5000,
    current_workers INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'paused', 'scaling'
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_worker_pools_name ON worker_pools(name);
CREATE INDEX idx_worker_pools_pack ON worker_pools(pack_id);
CREATE INDEX idx_worker_pools_queue ON worker_pools(queue_name);

-- ============================================
-- WORKFLOWS
-- ============================================

-- Workflows (chains of agent actions)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    definition JSONB NOT NULL,              -- workflow DAG definition
    status TEXT NOT NULL DEFAULT 'draft',   -- 'draft', 'active', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflows_org ON workflows(org_id);

-- Workflow runs
CREATE TABLE workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    trace_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running', -- 'running', 'succeeded', 'failed', 'cancelled'
    input JSONB,
    output JSONB,
    error TEXT,
    current_step INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ
);

CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_org ON workflow_runs(org_id);

-- ============================================
-- ROADCHAIN (AUDIT LOG)
-- ============================================

-- RoadChain entries (immutable append-only log)
CREATE TABLE roadchain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,              -- 'agent', 'job', 'workflow', 'user'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,                   -- 'created', 'updated', 'executed', 'deleted'
    actor_type TEXT NOT NULL,               -- 'user', 'agent', 'system'
    actor_id UUID,
    payload JSONB DEFAULT '{}',
    ps_sha_id TEXT,                         -- reference to agent PS-SHA if applicable
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadchain_org ON roadchain(org_id);
CREATE INDEX idx_roadchain_entity ON roadchain(entity_type, entity_id);
CREATE INDEX idx_roadchain_created ON roadchain(created_at DESC);
CREATE INDEX idx_roadchain_actor ON roadchain(actor_type, actor_id);

-- ============================================
-- METRICS & HEALTH
-- ============================================

-- Agent metrics (aggregated stats)
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    jobs_total INT NOT NULL DEFAULT 0,
    jobs_succeeded INT NOT NULL DEFAULT 0,
    jobs_failed INT NOT NULL DEFAULT 0,
    avg_latency_ms FLOAT,
    p95_latency_ms FLOAT,
    error_rate FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_metrics_agent ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_period ON agent_metrics(period_start, period_end);

-- Worker pool metrics
CREATE TABLE worker_pool_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_pool_id UUID NOT NULL REFERENCES worker_pools(id) ON DELETE CASCADE,
    period_start TIMESTAMPTZ NOT NULL,
    queue_depth INT NOT NULL DEFAULT 0,
    active_workers INT NOT NULL DEFAULT 0,
    jobs_processed INT NOT NULL DEFAULT 0,
    avg_latency_ms FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_worker_pool_metrics_pool ON worker_pool_metrics(worker_pool_id);
CREATE INDEX idx_worker_pool_metrics_period ON worker_pool_metrics(period_start);

-- ============================================
-- ROW LEVEL SECURITY (OPTIONAL)
-- ============================================

-- Enable RLS on multi-tenant tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadchain ENABLE ROW LEVEL SECURITY;

-- Create policies (org isolation)
-- Note: These require setting app.current_org before queries
CREATE POLICY org_isolation_agents ON agents
    USING (org_id = current_setting('app.current_org', true)::uuid);

CREATE POLICY org_isolation_jobs ON jobs
    USING (org_id = current_setting('app.current_org', true)::uuid);

CREATE POLICY org_isolation_workflows ON workflows
    USING (org_id = current_setting('app.current_org', true)::uuid);

CREATE POLICY org_isolation_workflow_runs ON workflow_runs
    USING (org_id = current_setting('app.current_org', true)::uuid);

CREATE POLICY org_isolation_roadchain ON roadchain
    USING (org_id = current_setting('app.current_org', true)::uuid);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default packs
INSERT INTO packs (id, key, name, description, manifest) VALUES
    (uuid_generate_v4(), 'finance', 'Finance Pack', 'Agents for financial operations, invoicing, expense tracking, and cashflow analysis', '{"version": "1.0.0", "category": "finance"}'),
    (uuid_generate_v4(), 'education', 'Education Pack', 'Agents for learning, tutoring, curriculum design, and educational content', '{"version": "1.0.0", "category": "education"}'),
    (uuid_generate_v4(), 'creator_studio', 'Creator Studio Pack', 'Agents for content creation, video editing, and creative workflows', '{"version": "1.0.0", "category": "creative"}'),
    (uuid_generate_v4(), 'infra_devops', 'Infra DevOps Pack', 'Agents for infrastructure management, CI/CD, and DevOps automation', '{"version": "1.0.0", "category": "infrastructure"}'),
    (uuid_generate_v4(), 'legal', 'Legal Pack', 'Agents for legal document analysis, contract review, and compliance', '{"version": "1.0.0", "category": "legal"}'),
    (uuid_generate_v4(), 'research_lab', 'Research Lab Pack', 'Agents for research, data analysis, and experimentation', '{"version": "1.0.0", "category": "research"}');

-- Insert default worker pools (one per pack)
INSERT INTO worker_pools (name, pack_id, queue_name, min_workers, max_workers, target_latency_ms)
SELECT
    key || '-default' as name,
    id as pack_id,
    'jobs.' || key || '.default' as queue_name,
    1 as min_workers,
    10 as max_workers,
    5000 as target_latency_ms
FROM packs;

-- ============================================
-- VERSION TRACKING
-- ============================================

CREATE TABLE schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema');
