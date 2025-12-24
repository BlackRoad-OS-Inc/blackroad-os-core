# Trinity Template Orchestration - Usage Examples

This document demonstrates how to use the Trinity template orchestration system in BlackRoad OS.

## Basic Setup

```typescript
import { TrinityOrchestrator, TrinityLight } from './src/trinity';

// Initialize the Trinity orchestrator
const trinity = new TrinityOrchestrator();
await trinity.initialize('.trinity');
```

## Example 1: Deploy a RedLight Template (3D Earth)

```typescript
// Get the RedLight orchestrator
const redLight = trinity.getOrchestrator(TrinityLight.RED);

// Create a new Earth template
const earthTemplate = await redLight.createTemplate(
  'BlackRoad Earth',
  RedLightCategory.WORLD,
  'Interactive 3D Earth visualization with city markers',
  '.trinity/redlight/templates/blackroad-earth.html'
);

// Deploy to Cloudflare Pages
const deployment = await redLight.deployTemplate({
  template_id: earthTemplate.id,
  light: TrinityLight.RED,
  target_environment: 'production',
});

console.log(`Earth deployed to: ${deployment.url}`);
// Output: Earth deployed to: https://blackroad-earth.blackroad.io

// Track analytics
await redLight.recordAnalytics(earthTemplate.id, {
  views: 1500,
  interactions: 850,
  avg_performance: {
    fps: 60,
    load_time: 1200, // ms
  },
});
```

## Example 2: Manage GreenLight Tasks

```typescript
// Get the GreenLight orchestrator
const greenLight = trinity.getOrchestrator(TrinityLight.GREEN);

// Create a deployment task
const task = await greenLight.createTask(
  'Deploy Mars Template',
  'Create and deploy interactive Mars 3D visualization',
  '🌸',  // scale: medium
  '🎨',  // domain: creative
  '⭐',  // priority: high
  '🏗️'   // effort: large
);

// Assign to an agent
await greenLight.assignTask(task.id, 'cece');

// Link to a project
await greenLight.linkToProject(task.id, 'Solar System Templates', 'Planetary Visualizations');

// Progress through states
await greenLight.transitionState(task.id, GreenLightState.WIP);
console.log('Task is now in progress');

await greenLight.transitionState(task.id, GreenLightState.REVIEW);
console.log('Task is ready for review');

await greenLight.transitionState(task.id, GreenLightState.DONE);
console.log('Task completed!');

// Check task history
const history = greenLight.getStateHistory(task.id);
console.log('State history:', history);
// Output: ['inbox', 'wip', 'review', 'done']
```

## Example 3: Deploy Infrastructure with YellowLight

```typescript
// Get the YellowLight orchestrator
const yellowLight = trinity.getOrchestrator(TrinityLight.YELLOW);

// Create API service infrastructure
const apiService = await yellowLight.createInfrastructure(
  'BlackRoad API',
  'Main API service for template management',
  YellowLightPlatform.RAILWAY,
  'service',
  'blackroad-api',
  'production',
  {
    runtime: 'node:18',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    envVars: {
      NODE_ENV: 'production',
      PORT: '8080',
    },
  }
);

// Deploy the service
const apiDeployment = await yellowLight.deployInfrastructure({
  template_id: apiService.id,
  light: TrinityLight.YELLOW,
  target_environment: 'production',
});

console.log(`API deployed to: ${apiDeployment.url}`);
// Output: API deployed to: https://blackroad-api.railway.app

// Monitor health
const health = await yellowLight.performHealthCheck(apiService.id);
console.log(`Service status: ${health.status}`);
if (health.status === 'healthy') {
  console.log('✅ All health checks passed');
}
```

## Example 4: Cross-Light Coordination Workflow

This example demonstrates the power of Trinity: coordinating all three lights to deploy a complete feature.

```typescript
// Create a coordination from the built-in template
const coordination = trinity.createCoordinationFromTemplate(
  'deploy-earth-template',
  'Deploy Earth Visualization'
);

console.log(`Coordination includes ${coordination.lights.length} lights`);
console.log(`Workflow has ${coordination.workflow.length} steps`);

// Execute the coordination
const tasks = await trinity.executeCoordination(coordination);

// The coordination will:
// 1. 💚 Create deployment task in GreenLight
// 2. 🔴 Create Earth template in RedLight
// 3. 💛 Deploy to Cloudflare Pages via YellowLight
// 4. 💛 Configure DNS
// 5. 💚 Mark deployment task complete

console.log('All tasks completed:');
tasks.forEach((task, i) => {
  console.log(`  ${i + 1}. ${task.operation} (${task.light}) - ${task.status}`);
});
```

## Example 5: Full Stack Feature Deployment

Deploy a complete feature with UI, API, and tracking:

```typescript
// Create coordination for full stack feature
const fullStackCoord = trinity.createCoordinationFromTemplate(
  'deploy-full-stack-feature',
  'User Dashboard Feature'
);

// Execute the complete workflow
const featureTasks = await trinity.executeCoordination(fullStackCoord);

// This workflow:
// 1. 💚 Creates feature epic and tasks
// 2. 🔴 Creates UI template (parallel)
// 3. 💛 Provisions API service (parallel)
// 4. 🔴 Deploys UI to Cloudflare
// 5. 💛 Deploys API to Railway
// 6. 💛 Runs integration tests
// 7. 💚 Marks feature complete

console.log(`Feature deployed successfully!`);
console.log(`UI: ${featureTasks.find(t => t.light === TrinityLight.RED)?.result?.url}`);
console.log(`API: ${featureTasks.find(t => t.light === TrinityLight.YELLOW)?.result?.url}`);
```

## Example 6: Integration with Agent Orchestration

Integrate Trinity with the existing agent orchestration system:

```typescript
import { WorkflowEngine } from './src/agent-orchestration/AgentWorkflowEngine';

// Create workflow engine with Trinity
const workflowEngine = new WorkflowEngine(trinity);

// List available Trinity workflows
const templates = workflowEngine.listTemplates();
console.log('Available workflows:', templates.filter(t => t.startsWith('trinity-')));
// Output: ['trinity-template-deployment', 'trinity-full-stack-feature']

// Create workflow from Trinity template
const workflow = workflowEngine.createFromTemplate(
  'trinity-template-deployment',
  {
    templateName: 'Mars Globe',
    platform: 'cloudflare',
    environment: 'production',
  }
);

// Execute Trinity-coordinated workflow
const trinityCoord = trinity.createCoordinationFromTemplate(
  'deploy-earth-template',
  'Deploy via Workflow Engine'
);

const result = await workflowEngine.executeTrinityWorkflow(
  workflow.id,
  trinityCoord
);

console.log(`Workflow ${result.success ? 'succeeded' : 'failed'}`);
console.log(`Duration: ${result.duration}ms`);
```

## Example 7: System Health Monitoring

Monitor the health of all three lights:

```typescript
// Check overall Trinity system health
const systemHealth = await trinity.getSystemHealth();

console.log(`Trinity Status: ${systemHealth.status}`);

// Check each light
console.log('\n🔴 RedLight Status:', systemHealth.lights.redlight.status);
systemHealth.lights.redlight.checks?.forEach(check => {
  console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
});

console.log('\n💚 GreenLight Status:', systemHealth.lights.greenlight.status);
systemHealth.lights.greenlight.checks?.forEach(check => {
  console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
});

console.log('\n💛 YellowLight Status:', systemHealth.lights.yellowlight.status);
systemHealth.lights.yellowlight.checks?.forEach(check => {
  console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
});
```

## Example 8: Event-Driven Orchestration

Listen to Trinity events for real-time monitoring:

```typescript
// Listen to all Trinity events
trinity.on('coordination:started', (coord) => {
  console.log(`🌈 Starting coordination: ${coord.name}`);
});

trinity.on('coordination:completed', ({ coordination, tasks }) => {
  console.log(`✅ Completed coordination: ${coordination.name}`);
  console.log(`   Executed ${tasks.length} tasks`);
});

// Listen to RedLight events
trinity.on('redlight:template:created', (template) => {
  console.log(`🔴 Template created: ${template.name} (${template.category})`);
});

trinity.on('redlight:deployment:completed', (result) => {
  console.log(`🔴 Deployed to: ${result.url} in ${result.duration_ms}ms`);
});

// Listen to GreenLight events
trinity.on('greenlight:task:created', (task) => {
  console.log(`💚 Task created: ${task.name} [${task.priority}]`);
});

trinity.on('greenlight:state:transitioned', ({ template, oldState, newState }) => {
  console.log(`💚 ${template.name}: ${oldState} → ${newState}`);
});

// Listen to YellowLight events
trinity.on('yellowlight:infrastructure:created', (infra) => {
  console.log(`💛 Infrastructure created: ${infra.name} on ${infra.platform}`);
});

trinity.on('yellowlight:deployment:completed', (result) => {
  console.log(`💛 Service deployed: ${result.url}`);
});

// Execute a workflow and watch events
const coordination = trinity.createCoordinationFromTemplate(
  'deploy-earth-template',
  'Earth with Event Monitoring'
);

await trinity.executeCoordination(coordination);
// Events will be logged as the workflow executes
```

## Summary

The Trinity orchestration system provides:

1. **🔴 RedLight**: Visual template management (3D worlds, websites, animations)
2. **💚 GreenLight**: Project and task management with state transitions
3. **💛 YellowLight**: Infrastructure provisioning and deployment
4. **🌈 Trinity Coordinator**: Cross-light workflows for complex operations

Key features:
- Type-safe TypeScript implementation
- Event-driven architecture
- Built-in workflow templates
- Integration with agent orchestration
- Real-time health monitoring
- Cross-light coordination

The system enables BlackRoad OS to manage the complete lifecycle of templates and infrastructure through a unified, coordinated approach.
