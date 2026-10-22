# household-covenant-schema

MIT-licensed TypeScript schemas and deterministic replay consistency checks for household covenant applications. This package has no AWS, model-provider, MCP-server, or UI runtime dependency.

```ts
import {
  CovenantContractSchema,
  ReplayScenarioSchema,
  verifyReplayConsistency,
} from "@kithweal/household-covenant-schema";

const contract = CovenantContractSchema.parse(candidate);
const scenario = ReplayScenarioSchema.parse(input);
const consistency = verifyReplayConsistency(scenario);
```

`CovenantContractSchema` checks shape and types. It does not approve a household agreement, determine consent, or establish legal/medical suitability. `verifyReplayConsistency` checks mission IDs, versions, state continuity, and allowed state transitions; it does not modify data or decide whether a real-world action is appropriate.

## Local development

From the KithWealAI workspace root:

```sh
npm install
npm run build --workspace @kithweal/household-covenant-schema
npm test -- --pool=threads --maxWorkers=1
```

Package sources live under `src/`; `npm pack` runs the build and includes compiled ESM, declarations, README, and license. The repository workspaces consume the compiled package; root scripts build it before tests, typecheck, and app development.

## Companion

This package is the reusable companion artifact for the [KithWealAI Covenant Engine](../../README.md). No public registry release or separate GitHub repository is claimed yet. The copyright notice names project contributors; confirm ownership and contributor rights before publishing outside this repository.
