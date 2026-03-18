'use client';

import {
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  GitPullRequest,
  Rocket,
  Shield,
  TestTube2,
  Database,
  GitBranch,
  Globe,
  Zap,
  Server,
  ArrowRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Agent Team Pipeline Visual                                         */
/* ------------------------------------------------------------------ */

const AGENT_STEPS = [
  {
    icon: Brain,
    label: 'Brainstorm',
    detail: 'Explore approaches',
    color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  },
  {
    icon: Code2,
    label: 'Plan & Build',
    detail: 'PRD → implementation',
    color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  },
  {
    icon: TestTube2,
    label: 'Test',
    detail: 'Auto-generated suites',
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Shield,
    label: 'Review',
    detail: 'Security + architecture',
    color: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  },
  {
    icon: GitPullRequest,
    label: 'Ship',
    detail: 'PR + CI + merge',
    color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  },
];

export function AgentTeamVisual() {
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] to-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/15">
          <Bot size={20} className="text-violet-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Agent Team Pipeline</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-violet-400">$</span> /work
          </div>
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="space-y-2.5">
        {AGENT_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${step.color}`}
            >
              <step.icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{step.label}</span>
                <CheckCircle2 size={14} className="text-emerald-400/60" />
              </div>
              <span className="text-xs text-muted-foreground">{step.detail}</span>
            </div>
            {i < AGENT_STEPS.length - 1 && <div className="hidden" /> /* spacing handled by gap */}
          </div>
        ))}
      </div>

      {/* Result summary */}
      <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
          <Rocket size={14} />
          PR #42 ready — 12/12 tests passing
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          3 files changed, schema migration applied, CI green
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Railway Deploy Visual                                              */
/* ------------------------------------------------------------------ */

const SERVICES = [
  { name: 'API', tech: 'Hono + tRPC', status: 'live', color: 'text-emerald-400' },
  { name: 'Web', tech: 'Next.js', status: 'live', color: 'text-emerald-400' },
  { name: 'Marketing', tech: 'Next.js', status: 'live', color: 'text-emerald-400' },
  { name: 'Docs', tech: 'Fumadocs', status: 'live', color: 'text-emerald-400' },
];

export function RailwayDeployVisual() {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] to-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15">
          <Rocket size={20} className="text-cyan-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Railway Deploy Pipeline</div>
          <div className="text-xs text-muted-foreground">git push → auto-deploy</div>
        </div>
      </div>

      {/* Deploy flow */}
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 font-mono text-xs">
        <span className="text-cyan-glow">$</span>
        <span className="text-foreground">git push origin main</span>
        <ArrowRight size={12} className="ml-auto text-muted-foreground" />
        <span className="text-emerald-400">deployed</span>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {SERVICES.map((svc) => (
          <div key={svc.name} className="rounded-lg border border-border bg-card/50 px-3.5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={13} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{svc.name}</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{svc.tech}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          <Globe size={12} className="mr-1 inline text-cyan-400" />4 services deployed
        </span>
        <span>
          <Zap size={12} className="mr-1 inline text-yellow-400" />
          Auto-deploy on push
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Neon Database Visual                                               */
/* ------------------------------------------------------------------ */

const BRANCHES = [
  { name: 'main', tables: 12, size: '2.4 MB', active: true },
  { name: 'feat/dashboard', tables: 14, size: '2.6 MB', active: false },
  { name: 'fix/auth-flow', tables: 12, size: '2.4 MB', active: false },
];

export function NeonDatabaseVisual() {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] to-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15">
          <Database size={20} className="text-emerald-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Neon Serverless Postgres</div>
          <div className="text-xs text-muted-foreground">Branch, develop, merge — like git</div>
        </div>
      </div>

      {/* Branch list */}
      <div className="space-y-2">
        {BRANCHES.map((branch) => (
          <div
            key={branch.name}
            className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 ${
              branch.active ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-card/50'
            }`}
          >
            <GitBranch
              size={14}
              className={branch.active ? 'text-emerald-400' : 'text-muted-foreground'}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{branch.name}</span>
                {branch.active && (
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    production
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {branch.tables} tables &middot; {branch.size}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border bg-card/50 px-3 py-2.5 text-muted-foreground">
          <Zap size={12} className="mb-1 text-yellow-400" />
          Scale to zero
        </div>
        <div className="rounded-lg border border-border bg-card/50 px-3 py-2.5 text-muted-foreground">
          <Globe size={12} className="mb-1 text-cyan-400" />
          Edge-ready driver
        </div>
      </div>
    </div>
  );
}
