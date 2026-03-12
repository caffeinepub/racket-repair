# RacketFix Admin Page

## Current State
RacketFix website with repair request form. Backend stores submissions via `submitRepairRequest`. No way to view bookings exists.

## Requested Changes (Diff)

### Add
- Admin page at `/admin` route showing all submitted repair requests
- Simple password login (hardcoded credentials: admin / racketfix2024)
- Table listing each booking: name, phone, email, racket brand, damage description, date submitted
- Logout button

### Modify
- App.tsx: add routing with react-router-dom to support `/admin` route

### Remove
- Nothing

## Implementation Plan
1. Add react-router-dom routing to App.tsx
2. Create AdminLogin component with password form
3. Create AdminPage component that fetches and displays repair requests
4. Wire up route `/admin` to show login or bookings based on auth state
