# RacketFix

## Current State
Backend stores repair requests using non-stable variables (`var nextRequestId` and `let repairRequests = Map.empty()`). This means all data is lost every time the canister is redeployed or upgraded.

## Requested Changes (Diff)

### Add
- Stable storage for repair requests so data persists across all future deployments

### Modify
- Backend: change `nextRequestId` and `repairRequests` to use stable variables with pre/post upgrade hooks so data survives canister upgrades

### Remove
- Nothing removed from the frontend

## Implementation Plan
1. Rewrite backend to use `stable var nextRequestId` and `stable var repairRequestEntries : [(Nat, RepairRequest)]` with `system func preupgrade` and `system func postupgrade` to serialize/deserialize the map on upgrade
