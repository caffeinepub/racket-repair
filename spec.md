# RacketFix – Service Jobs Feature

## Current State
Admin dashboard has 4 tabs: Repair Requests, Clients, Restringing, Inventory.
Backend stores RepairRequest, StockItem, StockTransaction in stable storage.
No dedicated service job tracking with advance/paid/balance breakdown.

## Requested Changes (Diff)

### Add
- New `ServiceJob` type in backend: id, customerName, mobileNo, serviceType, charges, advance, paid, balance (derived), status, timestamp
- Backend CRUD: addServiceJob, getAllServiceJobs, updateServiceJob, deleteServiceJob
- New "Service Jobs" tab in admin dashboard (5th tab)
- Add Service Job form: Customer Name, Mobile No, Type of Service, Charges, Advance, Paid (Balance auto-calculated = Charges - Advance - Paid)
- Service Jobs list table: all fields, edit, delete, status badge
- WhatsApp notification button per job row: opens WhatsApp to customer mobile with job summary
- Separate printable report for Service Jobs with date filter
- Stats cards for Service Jobs: Total Jobs, Total Charges, Total Balance Due

### Modify
- Dashboard `loadData` to also fetch service jobs
- Stats row to include Service Jobs count

### Remove
- Nothing removed

## Implementation Plan
1. Add `ServiceJob` type and stable storage vars to `main.mo`
2. Add `addServiceJob`, `getAllServiceJobs`, `updateServiceJob`, `deleteServiceJob` methods
3. Add `ServiceJobsTab` component in AdminPage with form + table + WhatsApp + print report
4. Wire loadData to fetch service jobs alongside existing data
5. Add 5th TabsTrigger/TabsContent for Service Jobs
