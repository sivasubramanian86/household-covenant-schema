import { describe, expect, it } from "vitest";
import {
  CovenantContractSchema,
  MissionEventSchema,
  MissionSchema,
  ReplayScenarioSchema,
  verifyReplayConsistency,
} from "./index.js";

const mission = MissionSchema.parse({
  missionId: "mission-1",
  familyId: "family-1",
  missionType: "kitchen-leak",
  state: "DRAFT",
  version: 0,
  updatedAt: "2026-10-22T10:00:00.000Z",
});

const event = MissionEventSchema.parse({
  missionId: "mission-1",
  eventId: "event-1",
  requestId: "request-1",
  requestFingerprint: "fingerprint-1",
  eventType: "STATE_TRANSITION",
  fromState: "DRAFT",
  toState: "READY",
  fromVersion: 0,
  toVersion: 1,
  actor: "adult-1",
  timestamp: "2026-10-22T10:01:00.000Z",
  explanation: { code: "REPORT_RECEIVED", metadata: {} },
});

describe("household covenant companion", () => {
  it("validates a structured household covenant contract", () => {
    const contract = {
      familyId: "family-1",
      covenantId: "covenant-1",
      version: 1,
      type: "plumbing",
      boundRoles: ["adult"],
      trigger: { code: "LEAK_REPORTED", params: {} },
      boundary: { autonomousActions: [], confirmationRequiredActions: [] },
      sensitivity: "low",
      escalationPath: [],
      completionSemantics: "explicit-confirmation-required",
      ambiguityPolicy: "hold-and-retry",
      exceptions: [],
      rules: [
        {
          ruleId: "rule-1",
          description: "Check in calmly",
          condition: { code: "LEAK_REPORTED", params: {} },
        },
      ],
      activatedBy: null,
      createdAt: "2026-10-22T10:00:00.000Z",
      status: "draft",
    };
    expect(CovenantContractSchema.parse(contract)).toMatchObject({
      covenantId: "covenant-1",
    });
    expect(() =>
      CovenantContractSchema.parse({ ...contract, version: 0 }),
    ).toThrow();
  });

  it("accepts a consistent replay and detects version gaps", () => {
    const scenario = ReplayScenarioSchema.parse({
      initialMission: mission,
      events: [event],
    });
    expect(verifyReplayConsistency(scenario)).toMatchObject({
      valid: true,
      finalState: "READY",
      errors: [],
    });
    expect(
      verifyReplayConsistency({
        ...scenario,
        events: [{ ...event, fromVersion: 2, toVersion: 3 }],
      }).errors,
    ).toContain("VERSION_GAP:request-1");
  });

  it("checks alternate paths without altering recorded-event consistency", () => {
    const scenario = ReplayScenarioSchema.parse({
      initialMission: mission,
      events: [event],
      alternatePath: { "request-1": "CANCELLED" },
    });
    expect(verifyReplayConsistency(scenario)).toMatchObject({
      valid: true,
      finalState: "CANCELLED",
    });
    expect(
      verifyReplayConsistency({
        ...scenario,
        alternatePath: { "request-1": "COMPLETED" },
      }).errors,
    ).toContain("ILLEGAL_ALTERNATE_TRANSITION:request-1");
  });
});
