# RacketFix

## Current State
RacketFix is a badminton/cricket repair website with:
- Homepage with booking form
- Admin dashboard at /admin with Repair Requests, Clients, and Restringing tabs
- Backend storing repair requests in stable storage

## Requested Changes (Diff)

### Add
- Stock inventory system in admin dashboard as a new "Inventory" tab
- Inventory items (e.g. Grip tape, BG65 String, Grommets) with name, category, and current stock quantity
- Stock transactions: IN (stock received) and OUT (stock used/sold) with date, quantity, notes, and item reference
- Computed current stock per item (starting qty + all IN - all OUT transactions)
- Excel/CSV download button that exports all stock transactions with columns: Date, Item Name, Category, Type (IN/OUT), Quantity, Notes, Running Balance
- Add Item dialog, Record Transaction dialog
- Date filter for transactions view

### Modify
- Backend: add inventory item and transaction types + CRUD functions
- AdminPage: add 4th tab "Inventory"

### Remove
- Nothing removed

## Implementation Plan
1. Add `StockItem` and `StockTransaction` types to Motoko backend
2. Add stable storage and CRUD functions: addStockItem, getStockItems, deleteStockItem, addStockTransaction, getStockTransactions, deleteStockTransaction
3. Regenerate backend.d.ts bindings
4. Add Inventory tab to AdminPage with:
   - Stock summary cards (total items, low stock alerts)
   - Items list table with current quantity
   - Transaction log with date filter
   - Add Item dialog
   - Record IN/OUT transaction dialog
   - Download Excel (CSV) button
