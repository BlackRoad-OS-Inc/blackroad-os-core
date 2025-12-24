/**
 * Trinity Orchestration Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TrinityOrchestrator, TrinityLight, RedLightCategory } from '../src/trinity';
import { WorkflowEngine } from '../src/agent-orchestration/AgentWorkflowEngine';

describe('Trinity Orchestration', () => {
  let trinity: TrinityOrchestrator;

  beforeEach(() => {
    trinity = new TrinityOrchestrator();
  });

  describe('RedLight Orchestrator', () => {
    it('should create a visual template', async () => {
      const redLight = trinity.getOrchestrator(TrinityLight.RED);
      
      const template = await redLight.createTemplate(
        'Test Earth',
        RedLightCategory.WORLD,
        'Test 3D Earth template',
        '.trinity/redlight/templates/test-earth.html'
      );

      expect(template.id).toBeDefined();
      expect(template.name).toBe('Test Earth');
      expect(template.category).toBe(RedLightCategory.WORLD);
      expect(template.light).toBe(TrinityLight.RED);
    });

    it('should deploy a template', async () => {
      const redLight = trinity.getOrchestrator(TrinityLight.RED);
      
      const template = await redLight.createTemplate(
        'Test Mars',
        RedLightCategory.WORLD,
        'Test Mars template',
        '.trinity/redlight/templates/test-mars.html'
      );

      const result = await redLight.deployTemplate({
        template_id: template.id,
        light: TrinityLight.RED,
        target_environment: 'production',
      });

      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.logs).toContain('Health check passed');
    });
  });

  describe('GreenLight Orchestrator', () => {
    it('should create a task', async () => {
      const greenLight = trinity.getOrchestrator(TrinityLight.GREEN);
      
      const task = await greenLight.createTask(
        'Test Feature',
        'Implement test feature',
        '👉', // micro
        '🛣️', // platform
        '📌', // medium priority
        '🍖'  // medium effort
      );

      expect(task.id).toBeDefined();
      expect(task.name).toBe('Test Feature');
      expect(task.light).toBe(TrinityLight.GREEN);
    });

    it('should transition task states', async () => {
      const greenLight = trinity.getOrchestrator(TrinityLight.GREEN);
      
      const task = await greenLight.createTask(
        'Test Task',
        'Test state transitions',
      );

      const wip = await greenLight.transitionState(task.id, 'wip' as any);
      expect(wip.state).toBe('wip');

      const done = await greenLight.transitionState(task.id, 'done' as any);
      expect(done.state).toBe('done');
    });
  });

  describe('YellowLight Orchestrator', () => {
    it('should create infrastructure', async () => {
      const yellowLight = trinity.getOrchestrator(TrinityLight.YELLOW);
      
      const infra = await yellowLight.createInfrastructure(
        'Test API',
        'Test API service',
        'railway' as any,
        'service',
        'test-api',
        'development',
        {}
      );

      expect(infra.id).toBeDefined();
      expect(infra.name).toBe('Test API');
      expect(infra.light).toBe(TrinityLight.YELLOW);
      expect(infra.platform).toBe('railway');
    });

    it('should deploy infrastructure', async () => {
      const yellowLight = trinity.getOrchestrator(TrinityLight.YELLOW);
      
      const infra = await yellowLight.createInfrastructure(
        'Test Service',
        'Test deployment',
        'cloudflare' as any,
        'service',
        'test-service',
        'production',
        {}
      );

      const result = await yellowLight.deployInfrastructure({
        template_id: infra.id,
        light: TrinityLight.YELLOW,
        target_environment: 'production',
      });

      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
    });
  });

  describe('Cross-Light Coordination', () => {
    it('should create coordination from template', () => {
      const coordination = trinity.createCoordinationFromTemplate(
        'deploy-earth-template',
        'Deploy Test Earth'
      );

      expect(coordination.id).toBeDefined();
      expect(coordination.name).toBe('Deploy Test Earth');
      expect(coordination.lights.length).toBeGreaterThan(0);
      expect(coordination.workflow.length).toBeGreaterThan(0);
    });

    it('should execute coordination workflow', async () => {
      const coordination = trinity.createCoordinationFromTemplate(
        'deploy-earth-template',
        'Deploy Test Earth'
      );

      const tasks = await trinity.executeCoordination(coordination);

      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every((t) => t.status === 'completed')).toBe(true);
    });
  });

  describe('WorkflowEngine Integration', () => {
    it('should integrate with agent workflow engine', () => {
      const workflowEngine = new WorkflowEngine(trinity);
      const trinityOrch = workflowEngine.getTrinityOrchestrator();

      expect(trinityOrch).toBe(trinity);
    });

    it('should list Trinity workflow templates', () => {
      const workflowEngine = new WorkflowEngine(trinity);
      const templates = workflowEngine.listTemplates();

      expect(templates).toContain('trinity-template-deployment');
      expect(templates).toContain('trinity-full-stack-feature');
    });
  });

  describe('System Health', () => {
    it('should check overall system health', async () => {
      const health = await trinity.getSystemHealth();

      expect(health.status).toBeDefined();
      expect(health.lights).toBeDefined();
      expect(health.lights.redlight).toBeDefined();
      expect(health.lights.greenlight).toBeDefined();
      expect(health.lights.yellowlight).toBeDefined();
    });
  });
});
