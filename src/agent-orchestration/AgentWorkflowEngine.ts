/**
 * Agent Workflow Engine - Executes complex multi-agent workflows
 *
 * This engine handles sophisticated workflows where multiple agents
 * collaborate in sequence or parallel to accomplish complex tasks.
 *
 * Think of it as a conductor leading an orchestra of AI agents.
 * 
 * Integrates with Trinity template orchestration system for
 * coordinated deployment and infrastructure management.
 */

import { EventEmitter } from 'events';
import { AgentType, AgentTask, AgentTaskResult } from './AgentOrchestrator';
import { TrinityOrchestrator, TrinityLight, TrinityCoordination } from '../trinity';

export enum WorkflowStepType {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  CONDITIONAL = 'conditional',
  LOOP = 'loop',
}

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  agent: AgentType;
  action: string;
  dependencies?: string[]; // IDs of steps that must complete first
  condition?: (context: WorkflowContext) => boolean;
  onSuccess?: string; // Next step ID
  onFailure?: string; // Alternative step ID
}

export interface WorkflowContext {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  stepResults: Map<string, AgentTaskResult>;
  metadata: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  initialContext: Partial<WorkflowContext>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  result?: WorkflowResult;
}

export interface WorkflowResult {
  success: boolean;
  outputs: Record<string, any>;
  executedSteps: string[];
  failedSteps?: string[];
  duration: number; // milliseconds
}

/**
 * Pre-built workflow templates for common scenarios
 */
export class WorkflowEngine extends EventEmitter {
  private workflows: Map<string, Workflow> = new Map();
  private templates: Map<string, Partial<Workflow>> = new Map();
  private trinity?: TrinityOrchestrator;

  constructor(trinity?: TrinityOrchestrator) {
    super();
    this.trinity = trinity;
    this.initializeTemplates();
  }

  /**
   * Initialize pre-built workflow templates
   */
  private initializeTemplates(): void {
    // PR Review Workflow
    this.templates.set('pr-review', {
      name: 'Pull Request Review',
      description: 'Comprehensive PR review by multiple agents',
      steps: [
        // Step 1: Cordelia assigns reviewers (parallel start)
        {
          id: 'assign-reviewers',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Assign appropriate reviewers based on code changes',
        },
        // Step 2: Parallel reviews
        {
          id: 'architecture-review',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CLAUDE,
          action: 'Review architecture and design patterns',
          dependencies: ['assign-reviewers'],
        },
        {
          id: 'security-scan',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.SILAS,
          action: 'Scan for security vulnerabilities',
          dependencies: ['assign-reviewers'],
        },
        {
          id: 'test-coverage',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ELIAS,
          action: 'Check test coverage and quality',
          dependencies: ['assign-reviewers'],
        },
        {
          id: 'ui-review',
          type: WorkflowStepType.CONDITIONAL,
          agent: AgentType.ANASTASIA,
          action: 'Review UI/UX if frontend changes detected',
          dependencies: ['assign-reviewers'],
          condition: (ctx) => ctx.inputs.hasUIChanges === true,
        },
        // Step 3: Silas decides if security blocks
        {
          id: 'security-decision',
          type: WorkflowStepType.CONDITIONAL,
          agent: AgentType.SILAS,
          action: 'Determine if security issues block merge',
          dependencies: ['security-scan'],
          onFailure: 'block-merge',
        },
        // Step 4: Cordelia consolidates feedback
        {
          id: 'consolidate-feedback',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Consolidate all reviewer feedback',
          dependencies: [
            'architecture-review',
            'security-scan',
            'test-coverage',
            'ui-review',
            'security-decision',
          ],
        },
        // Step 5: Final approval
        {
          id: 'final-approval',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CLAUDE,
          action: 'Make final approval decision',
          dependencies: ['consolidate-feedback'],
        },
      ],
    });

    // Feature Development Workflow
    this.templates.set('feature-development', {
      name: 'Feature Development',
      description: 'End-to-end feature development with multiple agents',
      steps: [
        // Step 1: Lucidia validates idea strategically
        {
          id: 'strategic-validation',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.LUCIDIA,
          action: 'Validate feature aligns with strategic roadmap',
        },
        // Step 2: Codex creates prototype
        {
          id: 'prototype',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CODEX,
          action: 'Build rapid prototype',
          dependencies: ['strategic-validation'],
        },
        // Step 3: Parallel reviews
        {
          id: 'architecture-design',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CLAUDE,
          action: 'Design architecture for production implementation',
          dependencies: ['prototype'],
        },
        {
          id: 'ux-design',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ANASTASIA,
          action: 'Design user experience and interface',
          dependencies: ['prototype'],
        },
        // Step 4: Implementation
        {
          id: 'implementation',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CODEX,
          action: 'Implement production-ready feature',
          dependencies: ['architecture-design', 'ux-design'],
        },
        // Step 5: Testing
        {
          id: 'generate-tests',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ELIAS,
          action: 'Generate comprehensive test suite',
          dependencies: ['implementation'],
        },
        // Step 6: Documentation
        {
          id: 'documentation',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.OPHELIA,
          action: 'Write user and developer documentation',
          dependencies: ['implementation'],
        },
        // Step 7: Performance validation
        {
          id: 'performance-check',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CADILLAC,
          action: 'Validate performance meets requirements',
          dependencies: ['generate-tests'],
        },
        // Step 8: Security audit
        {
          id: 'security-audit',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.SILAS,
          action: 'Security audit before deployment',
          dependencies: ['performance-check'],
        },
      ],
    });

    // Incident Response Workflow
    this.templates.set('incident-response', {
      name: 'Incident Response',
      description: 'Emergency incident response with war room',
      steps: [
        // Step 1: Athena activates war room
        {
          id: 'activate-war-room',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ATHENA,
          action: 'Activate incident response war room',
        },
        // Step 2: Parallel investigation
        {
          id: 'debug-investigation',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.SIDIAN,
          action: 'Investigate root cause',
          dependencies: ['activate-war-room'],
        },
        {
          id: 'metrics-analysis',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CECILIA,
          action: 'Analyze impact metrics',
          dependencies: ['activate-war-room'],
        },
        {
          id: 'service-health',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.OCTAVIA,
          action: 'Check service mesh health',
          dependencies: ['activate-war-room'],
        },
        // Step 3: Determine mitigation
        {
          id: 'determine-mitigation',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ATHENA,
          action: 'Determine mitigation strategy',
          dependencies: ['debug-investigation', 'metrics-analysis', 'service-health'],
        },
        // Step 4: Execute mitigation (conditional)
        {
          id: 'rollback',
          type: WorkflowStepType.CONDITIONAL,
          agent: AgentType.ATHENA,
          action: 'Execute emergency rollback',
          dependencies: ['determine-mitigation'],
          condition: (ctx) => ctx.outputs.mitigationStrategy === 'rollback',
        },
        {
          id: 'hotfix',
          type: WorkflowStepType.CONDITIONAL,
          agent: AgentType.CODEX,
          action: 'Deploy emergency hotfix',
          dependencies: ['determine-mitigation'],
          condition: (ctx) => ctx.outputs.mitigationStrategy === 'hotfix',
        },
        // Step 5: Validation
        {
          id: 'validate-resolution',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.OCTAVIA,
          action: 'Validate incident is resolved',
          dependencies: ['rollback', 'hotfix'],
        },
        // Step 6: Post-mortem
        {
          id: 'post-mortem',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.OPHELIA,
          action: 'Create incident post-mortem document',
          dependencies: ['validate-resolution'],
        },
      ],
    });

    // Performance Optimization Workflow
    this.templates.set('performance-optimization', {
      name: 'Performance Optimization',
      description: 'Comprehensive performance improvement workflow',
      steps: [
        // Step 1: Cecilia establishes baseline
        {
          id: 'baseline-metrics',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CECILIA,
          action: 'Establish performance baseline metrics',
        },
        // Step 2: Parallel profiling
        {
          id: 'bundle-analysis',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CADILLAC,
          action: 'Analyze bundle size and composition',
          dependencies: ['baseline-metrics'],
        },
        {
          id: 'database-profiling',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CADILLAC,
          action: 'Profile database queries',
          dependencies: ['baseline-metrics'],
        },
        {
          id: 'api-profiling',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CADILLAC,
          action: 'Profile API response times',
          dependencies: ['baseline-metrics'],
        },
        // Step 3: Generate optimizations
        {
          id: 'create-optimization-pr',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CADILLAC,
          action: 'Create PR with optimizations',
          dependencies: ['bundle-analysis', 'database-profiling', 'api-profiling'],
        },
        // Step 4: Test optimizations don't break things
        {
          id: 'validate-functionality',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ELIAS,
          action: 'Verify optimizations maintain functionality',
          dependencies: ['create-optimization-pr'],
        },
        // Step 5: Measure improvement
        {
          id: 'measure-improvement',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CECILIA,
          action: 'Measure actual performance improvement',
          dependencies: ['validate-functionality'],
        },
      ],
    });

    // Technical Debt Reduction Workflow
    this.templates.set('tech-debt-reduction', {
      name: 'Technical Debt Reduction',
      description: 'Gradual, patient technical debt elimination',
      steps: [
        // Step 1: Persephone analyzes dormant code
        {
          id: 'identify-debt',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.PERSEPHONE,
          action: 'Identify technical debt and dormant code',
        },
        // Step 2: Cecilia measures impact
        {
          id: 'measure-impact',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CECILIA,
          action: 'Measure impact and usage of legacy code',
          dependencies: ['identify-debt'],
        },
        // Step 3: Create migration plan
        {
          id: 'migration-plan',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.PERSEPHONE,
          action: 'Create gradual migration plan',
          dependencies: ['measure-impact'],
        },
        // Step 4: Claude reviews architecture
        {
          id: 'architecture-review',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CLAUDE,
          action: 'Review migration architecture',
          dependencies: ['migration-plan'],
        },
        // Step 5: Codex implements phase 1
        {
          id: 'implement-phase-1',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CODEX,
          action: 'Implement first phase of migration',
          dependencies: ['architecture-review'],
        },
        // Step 6: Elias creates tests
        {
          id: 'migration-tests',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ELIAS,
          action: 'Create tests for migrated code',
          dependencies: ['implement-phase-1'],
        },
        // Step 7: Ophelia documents changes
        {
          id: 'migration-guide',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.OPHELIA,
          action: 'Create migration guide for developers',
          dependencies: ['migration-tests'],
        },
      ],
    });

    // Trinity Template Deployment Workflow
    this.templates.set('trinity-template-deployment', {
      name: 'Trinity Template Deployment',
      description: 'Deploy visual template with full Trinity coordination',
      steps: [
        // Step 1: Cordelia creates deployment task in GreenLight
        {
          id: 'create-greenlight-task',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Create deployment task in GreenLight',
        },
        // Step 2: Codex creates/prepares RedLight template
        {
          id: 'prepare-redlight-template',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CODEX,
          action: 'Create or prepare RedLight visual template',
          dependencies: ['create-greenlight-task'],
        },
        // Step 3: Athena provisions infrastructure via YellowLight
        {
          id: 'provision-yellowlight-infra',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ATHENA,
          action: 'Provision infrastructure on target platform',
          dependencies: ['prepare-redlight-template'],
        },
        // Step 4: Silas security check
        {
          id: 'security-check',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.SILAS,
          action: 'Security scan before deployment',
          dependencies: ['provision-yellowlight-infra'],
        },
        // Step 5: Cadillac performance validation
        {
          id: 'performance-check',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CADILLAC,
          action: 'Validate performance meets targets',
          dependencies: ['security-check'],
        },
        // Step 6: Athena deploys template
        {
          id: 'deploy-template',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ATHENA,
          action: 'Deploy template to production',
          dependencies: ['performance-check'],
        },
        // Step 7: Cecilia monitors post-deployment
        {
          id: 'monitor-deployment',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CECILIA,
          action: 'Monitor deployment health and metrics',
          dependencies: ['deploy-template'],
        },
        // Step 8: Cordelia completes GreenLight task
        {
          id: 'complete-greenlight-task',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Mark deployment task complete in GreenLight',
          dependencies: ['monitor-deployment'],
        },
      ],
    });

    // Trinity Full Stack Feature Workflow
    this.templates.set('trinity-full-stack-feature', {
      name: 'Trinity Full Stack Feature',
      description: 'Deploy complete feature with UI, API, and coordination',
      steps: [
        // Step 1: Lucidia strategic validation
        {
          id: 'strategic-validation',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.LUCIDIA,
          action: 'Validate feature aligns with roadmap',
        },
        // Step 2: Cordelia creates epic and tasks in GreenLight
        {
          id: 'create-greenlight-epic',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Create feature epic and tasks in GreenLight',
          dependencies: ['strategic-validation'],
        },
        // Step 3: Parallel - Anastasia designs UI, Claude designs architecture
        {
          id: 'ui-design',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ANASTASIA,
          action: 'Design UI/UX for feature',
          dependencies: ['create-greenlight-epic'],
        },
        {
          id: 'api-architecture',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CLAUDE,
          action: 'Design API architecture',
          dependencies: ['create-greenlight-epic'],
        },
        // Step 4: Parallel - Codex implements UI template, API service provisioned
        {
          id: 'create-ui-template',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.CODEX,
          action: 'Create RedLight UI template',
          dependencies: ['ui-design'],
        },
        {
          id: 'provision-api-infra',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ATHENA,
          action: 'Provision API infrastructure via YellowLight',
          dependencies: ['api-architecture'],
        },
        // Step 5: Parallel - Deploy UI and API
        {
          id: 'deploy-ui',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ATHENA,
          action: 'Deploy UI template via RedLight orchestrator',
          dependencies: ['create-ui-template'],
        },
        {
          id: 'deploy-api',
          type: WorkflowStepType.PARALLEL,
          agent: AgentType.ATHENA,
          action: 'Deploy API service via YellowLight orchestrator',
          dependencies: ['provision-api-infra'],
        },
        // Step 6: Elias runs integration tests
        {
          id: 'integration-tests',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.ELIAS,
          action: 'Run integration tests between UI and API',
          dependencies: ['deploy-ui', 'deploy-api'],
        },
        // Step 7: Silas security audit
        {
          id: 'security-audit',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.SILAS,
          action: 'Security audit of deployed feature',
          dependencies: ['integration-tests'],
        },
        // Step 8: Cecilia monitors post-deployment
        {
          id: 'post-deployment-monitoring',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CECILIA,
          action: 'Monitor feature health and performance',
          dependencies: ['security-audit'],
        },
        // Step 9: Cordelia completes GreenLight epic
        {
          id: 'complete-greenlight-epic',
          type: WorkflowStepType.SEQUENTIAL,
          agent: AgentType.CORDELIA,
          action: 'Mark feature epic complete in GreenLight',
          dependencies: ['post-deployment-monitoring'],
        },
      ],
    });
  }

  /**
   * Create workflow from template
   */
  public createFromTemplate(templateName: string, inputs: Record<string, any>): Workflow {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Workflow template '${templateName}' not found`);
    }

    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: template.name || 'Unnamed Workflow',
      description: template.description || '',
      steps: template.steps || [],
      initialContext: {
        inputs,
        outputs: {},
        stepResults: new Map(),
        metadata: {
          template: templateName,
          createdAt: new Date(),
        },
      },
      status: 'pending',
    };

    this.workflows.set(workflow.id, workflow);
    this.emit('workflow:created', workflow);

    return workflow;
  }

  /**
   * Execute a workflow
   */
  public async executeWorkflow(workflowId: string): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    workflow.status = 'running';
    workflow.startedAt = new Date();
    this.emit('workflow:started', workflow);

    const context: WorkflowContext = {
      inputs: workflow.initialContext.inputs || {},
      outputs: {},
      stepResults: new Map(),
      metadata: workflow.initialContext.metadata || {},
    };

    const executedSteps: string[] = [];
    const failedSteps: string[] = [];

    try {
      // Execute steps in dependency order
      const executionPlan = this.planExecution(workflow.steps);

      for (const batch of executionPlan) {
        // Execute parallel steps
        const batchPromises = batch.map((step) => this.executeStep(step, context));
        const results = await Promise.allSettled(batchPromises);

        results.forEach((result, index) => {
          const step = batch[index];
          if (result.status === 'fulfilled') {
            executedSteps.push(step.id);
            context.stepResults.set(step.id, result.value);
          } else {
            failedSteps.push(step.id);
          }
        });

        // If any critical step failed, stop execution
        if (failedSteps.length > 0) {
          break;
        }
      }

      const duration = Date.now() - (workflow.startedAt?.getTime() || 0);

      const result: WorkflowResult = {
        success: failedSteps.length === 0,
        outputs: context.outputs,
        executedSteps,
        failedSteps: failedSteps.length > 0 ? failedSteps : undefined,
        duration,
      };

      workflow.status = result.success ? 'completed' : 'failed';
      workflow.completedAt = new Date();
      workflow.result = result;

      this.emit('workflow:completed', workflow);

      return result;
    } catch (error) {
      workflow.status = 'failed';
      workflow.completedAt = new Date();
      this.emit('workflow:failed', { workflow, error });
      throw error;
    }
  }

  /**
   * Plan execution order respecting dependencies
   */
  private planExecution(steps: WorkflowStep[]): WorkflowStep[][] {
    const plan: WorkflowStep[][] = [];
    const completed = new Set<string>();
    const remaining = [...steps];

    while (remaining.length > 0) {
      const batch: WorkflowStep[] = [];

      // Find steps that can execute (all dependencies met)
      for (let i = remaining.length - 1; i >= 0; i--) {
        const step = remaining[i];
        const canExecute =
          !step.dependencies || step.dependencies.every((dep) => completed.has(dep));

        if (canExecute) {
          batch.push(step);
          completed.add(step.id);
          remaining.splice(i, 1);
        }
      }

      if (batch.length === 0 && remaining.length > 0) {
        throw new Error('Circular dependency detected in workflow');
      }

      if (batch.length > 0) {
        plan.push(batch);
      }
    }

    return plan;
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<AgentTaskResult> {
    // Check condition if conditional step
    if (step.condition && !step.condition(context)) {
      return {
        success: true,
        output: 'Step skipped due to condition',
        confidence: 100,
      };
    }

    this.emit('step:started', step);

    // Simulate step execution (in real implementation, call orchestrator)
    const result: AgentTaskResult = {
      success: true,
      output: `${step.agent} completed: ${step.action}`,
      recommendations: [`Next: ${step.onSuccess || 'continue'}`],
      confidence: 90,
    };

    this.emit('step:completed', { step, result });

    return result;
  }

  /**
   * Get workflow status
   */
  public getWorkflowStatus(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * List all available workflow templates
   */
  public listTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Generate unique workflow ID
   */
  private generateWorkflowId(): string {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute a Trinity-coordinated workflow
   * Delegates to Trinity orchestrator for cross-light coordination
   */
  public async executeTrinityWorkflow(
    workflowId: string,
    trinityCoordination: TrinityCoordination
  ): Promise<WorkflowResult> {
    if (!this.trinity) {
      throw new Error('Trinity orchestrator not initialized');
    }

    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    this.emit('trinity-workflow:started', { workflowId, trinityCoordination });

    try {
      // Execute Trinity coordination
      const trinityTasks = await this.trinity.executeCoordination(trinityCoordination);

      // Update workflow status
      workflow.status = 'completed';
      workflow.completedAt = new Date();

      const result: WorkflowResult = {
        success: true,
        outputs: {
          trinityTasks,
          coordination: trinityCoordination,
        },
        executedSteps: trinityTasks.map((t) => t.id),
        duration: workflow.completedAt.getTime() - (workflow.startedAt?.getTime() || 0),
      };

      workflow.result = result;
      this.emit('trinity-workflow:completed', { workflowId, result });

      return result;
    } catch (error) {
      workflow.status = 'failed';
      workflow.completedAt = new Date();

      const result: WorkflowResult = {
        success: false,
        outputs: {},
        executedSteps: [],
        failedSteps: [error instanceof Error ? error.message : String(error)],
        duration: workflow.completedAt.getTime() - (workflow.startedAt?.getTime() || 0),
      };

      workflow.result = result;
      this.emit('trinity-workflow:failed', { workflowId, error });

      throw error;
    }
  }

  /**
   * Get Trinity orchestrator instance
   */
  public getTrinityOrchestrator(): TrinityOrchestrator | undefined {
    return this.trinity;
  }
}

// Export singleton instance (can be initialized with Trinity)
export const workflowEngine = new WorkflowEngine();
