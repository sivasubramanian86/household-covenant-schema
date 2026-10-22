import { z } from "zod";

const ScalarSchema = z.union([z.string(), z.number(), z.boolean()]);

export const ConditionSchema = z
  .object({
    code: z.string(),
    params: z.record(z.string(), ScalarSchema).default({}),
  })
  .strict();

export const QuietHoursSchema = z
  .object({
    startHH: z.number(),
    startMM: z.number(),
    endHH: z.number(),
    endMM: z.number(),
    timezone: z.string(),
    override: z.string().optional(),
  })
  .strict();

export const EscalationStepSchema = z
  .object({
    stepIndex: z.number(),
    action: z.string(),
    targetRole: z.string(),
    windowMinutes: z.number(),
    severity: z.string(),
  })
  .strict();

export const EscalationRuleSchema = z
  .object({
    threshold: z.number(),
    thresholdUnit: z.string(),
    escalationSteps: z.array(EscalationStepSchema),
    fastEscalation: z.boolean().optional(),
    fastEscalationCondition: z.string().optional(),
  })
  .strict();

export const CovenantRuleSchema = z
  .object({
    ruleId: z.string(),
    description: z.string(),
    condition: ConditionSchema,
    escalationRule: EscalationRuleSchema.optional(),
    checklistSteps: z.array(z.string()).optional(),
  })
  .strict();

export const CovenantExceptionSchema = z
  .object({
    exceptionId: z.string(),
    condition: ConditionSchema,
    overrides: z.record(z.string(), ScalarSchema),
    activatedBy: z.string(),
  })
  .strict();

export const DignityConstraintsSchema = z
  .object({
    prohibitedPatterns: z.array(z.string()),
    prohibitedEscalationTargets: z.array(z.string()),
    fallbackTemplateKey: z.string(),
  })
  .strict();

export const BoundarySchema = z
  .object({
    autonomousActions: z.array(z.string()),
    confirmationRequiredActions: z.array(z.string()),
  })
  .strict();

export const BurdenPreferencesSchema = z
  .object({
    balancePlanningLoad: z.boolean(),
    excludedRoles: z.array(z.string()),
  })
  .strict();

export const MealModePreferencesSchema = z
  .object({
    peacePriority: z.boolean(),
    dietaryConstraints: z.array(z.string()),
    pantryItems: z.array(z.string()),
    scheduledDinnerTime: z.string().optional(),
  })
  .strict();

export const CovenantProposalSchema = z
  .object({
    type: z.string(),
    boundRoles: z.array(z.string()),
    trigger: ConditionSchema,
    boundary: BoundarySchema,
    sensitivity: z.string(),
    missionOpenGraceMinutes: z.number().optional(),
    quietHours: QuietHoursSchema.optional(),
    escalationPath: z.array(EscalationStepSchema),
    completionSemantics: z.string(),
    completionTimeoutMinutes: z.number().optional(),
    ambiguityPolicy: z.string(),
    exceptions: z.array(CovenantExceptionSchema),
    dignityConstraints: DignityConstraintsSchema.optional(),
    rules: z.array(CovenantRuleSchema),
    burdenPreferences: BurdenPreferencesSchema.optional(),
    mealModePreferences: MealModePreferencesSchema.optional(),
    confidence: z.number(),
    ambiguities: z.array(z.string()),
  })
  .strict();

export const CovenantDraftSchema = z
  .object({
    familyId: z.string(),
    draftId: z.string(),
    sourceUtterance: z.string(),
    compiledAt: z.string(),
    compiledBy: z.literal("bedrock"),
    proposal: CovenantProposalSchema.nullable(),
    validationErrors: z.array(z.string()),
  })
  .strict();

export const CovenantContractSchema = z
  .object({
    familyId: z.string(),
    covenantId: z.string(),
    version: z.number().int().positive(),
    type: z.enum(["plumbing", "medication", "meal"]),
    boundRoles: z.array(z.string()).min(1),
    trigger: ConditionSchema,
    boundary: BoundarySchema,
    sensitivity: z.enum(["low", "medium", "high"]),
    missionOpenGraceMinutes: z.number().int().positive().optional(),
    quietHours: QuietHoursSchema.optional(),
    escalationPath: z.array(EscalationStepSchema),
    completionSemantics: z.enum([
      "explicit-confirmation-required",
      "timeout-with-no-escalation",
      "all-checklist-steps-confirmed",
    ]),
    completionTimeoutMinutes: z.number().positive().optional(),
    ambiguityPolicy: z.enum(["escalate-on-unresolved", "hold-and-retry"]),
    exceptions: z.array(CovenantExceptionSchema),
    dignityConstraints: DignityConstraintsSchema.optional(),
    rules: z.array(CovenantRuleSchema).min(1),
    burdenPreferences: BurdenPreferencesSchema.optional(),
    mealModePreferences: MealModePreferencesSchema.optional(),
    activatedBy: z.string().nullable(),
    createdAt: z.string(),
    status: z.enum(["draft", "active", "superseded"]),
  })
  .strict();

export const MissionStateSchema = z.enum([
  "DRAFT",
  "READY",
  "ACTIVE",
  "WAITING_FOR_CONFIRMATION",
  "ESCALATION_PENDING",
  "ESCALATED",
  "COMPLETED",
  "CANCELLED",
  "BLOCKED",
]);

export const MissionSchema = z
  .object({
    missionId: z.string().min(1),
    familyId: z.string().min(1),
    missionType: z
      .enum(["kitchen-leak", "medication", "dinner-delay"])
      .optional(),
    state: MissionStateSchema,
    version: z.number().int().nonnegative(),
    assignedTo: z.string().optional(),
    burdenScore: z.number().nonnegative().optional(),
    updatedAt: z.string(),
  })
  .strict();

export const MissionEventSchema = z
  .object({
    missionId: z.string().min(1),
    eventId: z.string().min(1),
    requestId: z.string().min(1),
    requestFingerprint: z.string().min(1),
    eventType: z.literal("STATE_TRANSITION"),
    fromState: MissionStateSchema,
    toState: MissionStateSchema,
    fromVersion: z.number().int().nonnegative(),
    toVersion: z.number().int().positive(),
    actor: z.string().min(1),
    timestamp: z.string(),
    explanation: z
      .object({
        code: z.string().min(1),
        metadata: z.record(z.string(), z.unknown()),
      })
      .strict(),
  })
  .strict();

export const BurdenLedgerEntrySchema = z
  .object({
    familyId: z.string().min(1),
    memberId: z.string().min(1),
    windowStart: z.iso.date(),
    assignedCount: z.number().int().nonnegative(),
    taskTypes: z.array(z.string().min(1)),
    lastAssignedAt: z.iso.datetime(),
    ttl: z.number().int().positive(),
  })
  .strict();

export const EscalationDecisionSchema = z
  .object({
    escalationRequired: z.boolean(),
    target: z.string().nullable(),
    reasonCode: z.string().min(1),
    metadata: z.record(z.string(), z.unknown()),
  })
  .strict();

export const EvidenceRecordSchema = z
  .object({
    kind: z.enum(["stated", "observed", "inferred", "covenant", "history"]),
    source: z.string().min(1),
    label: z.string().min(1),
    reference: z.string().optional(),
  })
  .strict();

export const ReplayScenarioSchema = z
  .object({
    initialMission: MissionSchema,
    events: z.array(MissionEventSchema),
    alternatePath: z.record(z.string(), MissionStateSchema).default({}),
  })
  .strict();

export const ReplayResultSchema = z
  .object({
    originalState: MissionStateSchema,
    replayedState: MissionStateSchema,
    divergences: z.array(
      z.object({
        requestId: z.string(),
        recordedState: MissionStateSchema,
        replayedState: MissionStateSchema,
      }),
    ),
    events: z.array(MissionEventSchema),
  })
  .strict();

export type CovenantType = z.infer<typeof CovenantContractSchema>["type"];
export type Condition = z.infer<typeof ConditionSchema>;
export type EscalationStep = z.infer<typeof EscalationStepSchema>;
export type CovenantRule = z.infer<typeof CovenantRuleSchema>;
export type CovenantProposal = z.infer<typeof CovenantProposalSchema>;
export type CovenantDraft = z.infer<typeof CovenantDraftSchema>;
export type CovenantContract = z.infer<typeof CovenantContractSchema>;
export type MissionState = z.infer<typeof MissionStateSchema>;
export type Mission = z.infer<typeof MissionSchema>;
export type MissionEvent = z.infer<typeof MissionEventSchema>;
export type BurdenLedgerEntry = z.infer<typeof BurdenLedgerEntrySchema>;
export type EscalationDecision = z.infer<typeof EscalationDecisionSchema>;
export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;
export type ReplayScenario = z.infer<typeof ReplayScenarioSchema>;
export type ReplayResult = z.infer<typeof ReplayResultSchema>;

export const LEGAL_MISSION_TRANSITIONS: Record<MissionState, MissionState[]> = {
  DRAFT: ["READY", "CANCELLED", "BLOCKED"],
  READY: ["ACTIVE", "CANCELLED", "BLOCKED"],
  ACTIVE: [
    "WAITING_FOR_CONFIRMATION",
    "ESCALATION_PENDING",
    "COMPLETED",
    "CANCELLED",
    "BLOCKED",
  ],
  WAITING_FOR_CONFIRMATION: [
    "ACTIVE",
    "ESCALATION_PENDING",
    "COMPLETED",
    "CANCELLED",
    "BLOCKED",
  ],
  ESCALATION_PENDING: ["ESCALATED", "ACTIVE", "CANCELLED", "BLOCKED"],
  ESCALATED: ["ACTIVE", "COMPLETED", "CANCELLED", "BLOCKED"],
  COMPLETED: [],
  CANCELLED: [],
  BLOCKED: ["READY", "CANCELLED"],
};

export interface ReplayConsistencyResult {
  valid: boolean;
  errors: string[];
  finalState: MissionState;
  events: MissionEvent[];
}

export function verifyReplayConsistency(
  scenarioInput: ReplayScenario,
): ReplayConsistencyResult {
  const scenario = ReplayScenarioSchema.parse(scenarioInput);
  let recordedState = scenario.initialMission.state;
  let replayedState = scenario.initialMission.state;
  let version = scenario.initialMission.version;
  const errors: string[] = [];
  const seenRequestIds = new Set<string>();
  const events = scenario.events
    .slice()
    .sort((a, b) => a.fromVersion - b.fromVersion);

  for (const event of events) {
    if (event.missionId !== scenario.initialMission.missionId) {
      errors.push(`MISSION_ID_MISMATCH:${event.requestId}`);
      continue;
    }
    if (seenRequestIds.has(event.requestId))
      errors.push("DUPLICATE_REQUEST_ID");
    seenRequestIds.add(event.requestId);
    if (event.fromVersion !== version || event.toVersion !== version + 1) {
      errors.push(`VERSION_GAP:${event.requestId}`);
      continue;
    }
    if (event.fromState !== recordedState) {
      errors.push(`STATE_DISCONTINUITY:${event.requestId}`);
      continue;
    }
    if (!LEGAL_MISSION_TRANSITIONS[recordedState].includes(event.toState)) {
      errors.push(`ILLEGAL_TRANSITION:${event.requestId}`);
      continue;
    }
    const alternateState =
      scenario.alternatePath[event.requestId] ?? event.toState;
    if (!LEGAL_MISSION_TRANSITIONS[replayedState].includes(alternateState)) {
      errors.push(`ILLEGAL_ALTERNATE_TRANSITION:${event.requestId}`);
    } else {
      replayedState = alternateState;
    }
    recordedState = event.toState;
    version = event.toVersion;
  }

  return {
    valid: errors.length === 0,
    errors,
    finalState: replayedState,
    events,
  };
}

export interface MissionReplayResult {
  originalState: MissionState;
  replayedState: MissionState;
  divergences: Array<{
    requestId: string;
    recordedState: MissionState;
    replayedState: MissionState;
  }>;
  events: MissionEvent[];
}

export function replayMission(
  initialInput: Mission,
  eventsInput: readonly MissionEvent[],
  alternatePath: Readonly<Record<string, MissionState>> = {},
): MissionReplayResult {
  const initial = MissionSchema.parse(initialInput);
  let state = initial.state;
  let version = initial.version;
  let originalState = initial.state;
  const divergences: MissionReplayResult["divergences"] = [];
  const events = eventsInput
    .filter((event) => event.missionId === initial.missionId)
    .slice()
    .sort((a, b) => a.fromVersion - b.fromVersion);

  for (const eventInput of events) {
    const event = MissionEventSchema.parse(eventInput);
    if (event.fromVersion !== version || event.fromState !== state) continue;
    originalState = event.toState;
    const replayedState = alternatePath[event.requestId] ?? event.toState;
    if (!LEGAL_MISSION_TRANSITIONS[state].includes(replayedState)) continue;
    if (replayedState !== event.toState) {
      divergences.push({
        requestId: event.requestId,
        recordedState: event.toState,
        replayedState,
      });
    }
    state = replayedState;
    version += 1;
  }
  return ReplayResultSchema.parse({
    originalState,
    replayedState: state,
    divergences,
    events,
  });
}
