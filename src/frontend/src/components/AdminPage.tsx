import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarRange,
  Inbox,
  Loader2,
  LogOut,
  Pencil,
  Printer,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { RepairRequest, backendInterface } from "../backend.d";
import { createActorWithConfig } from "../config";
import { AdminLogin } from "./AdminLogin";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("racketfix_admin") === "true",
  );

  function handleLogout() {
    localStorage.removeItem("racketfix_admin");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function EditDialog({
  request,
  open,
  onClose,
  onSaved,
  actor,
}: {
  request: RepairRequest | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  actor: backendInterface | null;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    racketBrand: "",
    damageDescription: "",
  });
  const [saving, setSaving] = useState(false);

  const prevId = useRef<bigint | null>(null);
  if (request && request.id !== prevId.current) {
    prevId.current = request.id;
    setForm({
      name: request.name,
      email: request.email,
      phone: request.phone,
      racketBrand: request.racketBrand,
      damageDescription: request.damageDescription,
    });
  }

  async function handleSave() {
    if (!request || !actor) return;
    setSaving(true);
    try {
      await actor.updateRepairRequest(
        request.id,
        form.name,
        form.email,
        form.phone,
        form.racketBrand,
        form.damageDescription,
      );
      toast.success("Booking updated successfully");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.dialog"
        style={{ backgroundColor: "#ffffff", border: "1px solid #c7d8f5" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#0f2d6e", fontWeight: 800 }}>
            Edit Booking
          </DialogTitle>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Name
            </Label>
            <Input
              data-ocid="admin.edit.input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Phone
            </Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Email
            </Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Racket Brand
            </Label>
            <Input
              value={form.racketBrand}
              onChange={(e) =>
                setForm((p) => ({ ...p, racketBrand: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Damage Description
            </Label>
            <Textarea
              data-ocid="admin.edit.textarea"
              value={form.damageDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, damageDescription: e.target.value }))
              }
              rows={3}
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
        </div>
        <DialogFooter style={{ marginTop: 8 }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="admin.edit.cancel_button"
            style={{ borderColor: "#c7d8f5", color: "#5c7aaa" }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            data-ocid="admin.edit.save_button"
            style={{
              backgroundColor: "#1a56db",
              color: "#ffffff",
              border: "none",
            }}
          >
            {saving ? (
              <>
                <Loader2
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 6,
                    display: "inline",
                  }}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAlertDialog({
  request,
  open,
  onClose,
  onDeleted,
  actor,
}: {
  request: RepairRequest | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
  actor: backendInterface | null;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!request || !actor) return;
    setDeleting(true);
    try {
      await actor.deleteRepairRequest(request.id);
      toast.success("Booking deleted");
      onDeleted();
      onClose();
    } catch {
      toast.error("Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        data-ocid="admin.delete.dialog"
        style={{ backgroundColor: "#ffffff", border: "1px solid #fca5a5" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "#0f2d6e", fontWeight: 800 }}>
            Delete Booking
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "#5c7aaa" }}>
            Are you sure you want to delete the booking for{" "}
            <strong style={{ color: "#0f2d6e" }}>{request?.name}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="admin.delete.cancel_button"
            style={{ borderColor: "#c7d8f5", color: "#5c7aaa" }}
            onClick={onClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="admin.delete.confirm_button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
            }}
          >
            {deleting ? (
              <>
                <Loader2
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 6,
                    display: "inline",
                  }}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function timeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s`)), ms),
    ),
  ]);
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [actor, setActor] = useState<backendInterface | null>(null);
  const [requests, setRequests] = useState<RepairRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [editTarget, setEditTarget] = useState<RepairRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RepairRequest | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      console.log(`[RacketFix] Loading attempt #${retryCount + 1}`);
      try {
        const a = await timeout(30000, createActorWithConfig());
        if (cancelled) return;
        setActor(a);
        const data = await timeout(30000, a.getAllRepairRequests());
        if (cancelled) return;
        setRequests(data);
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Failed to load repair requests:", err);
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  function handleRetry() {
    setActor(null);
    setRequests(null);
    setRetryCount((c) => c + 1);
  }

  async function reloadAfterMutation() {
    if (!actor) return;
    try {
      const data = await timeout(30000, actor.getAllRepairRequests());
      setRequests(data);
    } catch (err) {
      console.error("Failed to reload after mutation:", err);
      toast.error("Could not refresh list — please retry.");
    }
  }

  const generatedDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const filteredRequests = requests?.filter((req) => {
    const ms = Number(req.submissionTimestamp / 1_000_000n);
    const reqDate = new Date(ms);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (reqDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (reqDate > to) return false;
    }
    return true;
  });

  const hasDateFilter = dateFrom !== "" || dateTo !== "";

  function clearDateFilter() {
    setDateFrom("");
    setDateTo("");
  }

  function handlePrint() {
    window.print();
  }

  const dateRangeLabel =
    dateFrom && dateTo
      ? `${dateFrom} to ${dateTo}`
      : dateFrom
        ? `From ${dateFrom}`
        : dateTo
          ? `Until ${dateTo}`
          : "All dates";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-statement, #print-statement * { visibility: visible !important; }
          #print-statement {
            position: fixed !important;
            display: block !important;
            top: 0; left: 0; width: 100%;
            padding: 24px;
            background: white;
            color: #111;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          #print-statement table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          #print-statement th, #print-statement td {
            border: 1px solid #ccc;
            padding: 6px 10px;
            text-align: left;
            font-size: 11px;
          }
          #print-statement th { background: #f0f0f0; font-weight: 700; }
          .print-footer { margin-top: 16px; font-size: 11px; color: #555; border-top: 1px solid #ddd; padding-top: 8px; }
        }
      `}</style>

      {/* Hidden print block */}
      <div id="print-statement" style={{ display: "none" }} aria-hidden="true">
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            RacketFix — Repair Statement
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
            Generated: {generatedDate}
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            Date Range: {dateRangeLabel}
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            Address: 48-14-61 Beside Ramachandra Brothers, Near Ramatalkies,
            Visakhapatnam 530016
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Racket Brand</th>
              <th>Damage Description</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests?.map((req, i) => (
              <tr key={`${String(req.submissionTimestamp)}-${req.name}`}>
                <td>{i + 1}</td>
                <td>{req.name}</td>
                <td>{req.phone}</td>
                <td>{req.email}</td>
                <td>{req.racketBrand}</td>
                <td>{req.damageDescription}</td>
                <td>{formatTimestamp(req.submissionTimestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="print-footer">
          Total Requests: {filteredRequests?.length ?? 0} | RacketFix,
          Visakhapatnam — Ph: 9440790818
        </div>
      </div>

      {/* Edit Dialog */}
      <EditDialog
        request={editTarget}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSaved={() => void reloadAfterMutation()}
        actor={actor}
      />

      {/* Delete Alert Dialog */}
      <DeleteAlertDialog
        request={deleteTarget}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => void reloadAfterMutation()}
        actor={actor}
      />

      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #c7d8f5",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(26,86,219,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck style={{ color: "#1a56db", width: 24, height: 24 }} />
          <span
            style={{ color: "#0f2d6e", fontWeight: 800, fontSize: "1.2rem" }}
          >
            RacketFix Admin
          </span>
          <span
            style={{
              backgroundColor: "#e0eaff",
              color: "#1a56db",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px",
              border: "1px solid #c7d8f5",
            }}
          >
            Dashboard
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          data-ocid="admin.secondary_button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                color: "#0f2d6e",
                fontWeight: 800,
                fontSize: "1.6rem",
                margin: 0,
              }}
            >
              Repair Requests
            </h1>
            <p
              style={{
                color: "#5c7aaa",
                fontSize: "0.88rem",
                margin: "4px 0 0 0",
              }}
            >
              All customer bookings submitted through the website
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!loading && !error && (
              <span
                style={{
                  backgroundColor: "#e0eaff",
                  color: "#1a56db",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  padding: "4px 14px",
                  borderRadius: "999px",
                  border: "1px solid #c7d8f5",
                }}
              >
                {filteredRequests?.length ?? 0} request
                {(filteredRequests?.length ?? 0) !== 1 ? "s" : ""}
                {hasDateFilter &&
                requests &&
                filteredRequests &&
                filteredRequests.length !== requests.length
                  ? ` of ${requests.length}`
                  : ""}
              </span>
            )}
            {!loading &&
              !error &&
              filteredRequests &&
              filteredRequests.length > 0 && (
                <button
                  type="button"
                  onClick={handlePrint}
                  data-ocid="admin.print_button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    backgroundColor: "#ffffff",
                    color: "#1a56db",
                    border: "1px solid #c7d8f5",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Printer style={{ width: 16, height: 16 }} />
                  Print Statement
                </button>
              )}
          </div>
        </div>

        {/* Date Filter Bar */}
        {!loading && !error && (
          <div
            data-ocid="admin.date_filter.panel"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c7d8f5",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 2,
              }}
            >
              <CalendarRange
                style={{ color: "#1a56db", width: 18, height: 18 }}
              />
              <span
                style={{
                  color: "#0f2d6e",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                }}
              >
                Filter by Date
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 14,
                flex: 1,
              }}
            >
              <div>
                <label
                  htmlFor="date-from"
                  style={{
                    display: "block",
                    color: "#5c7aaa",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  From Date
                </label>
                <input
                  id="date-from"
                  type="date"
                  data-ocid="admin.date_filter.input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{
                    border: "1px solid #c7d8f5",
                    borderRadius: "6px",
                    padding: "7px 12px",
                    fontSize: "0.88rem",
                    color: "#0f2d6e",
                    backgroundColor: "#f8faff",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="date-to"
                  style={{
                    display: "block",
                    color: "#5c7aaa",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  To Date
                </label>
                <input
                  id="date-to"
                  type="date"
                  data-ocid="admin.date_filter.input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    border: "1px solid #c7d8f5",
                    borderRadius: "6px",
                    padding: "7px 12px",
                    fontSize: "0.88rem",
                    color: "#0f2d6e",
                    backgroundColor: "#f8faff",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
              {hasDateFilter && (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  data-ocid="admin.date_filter.cancel_button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "7px 14px",
                    backgroundColor: "#fff0f0",
                    color: "#dc2626",
                    border: "1px solid #fca5a5",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: 13, height: 13 }} />
                  Clear Filter
                </button>
              )}
              {hasDateFilter && (
                <span
                  style={{
                    backgroundColor: "#fff8e0",
                    color: "#b45309",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid #fde68a",
                    alignSelf: "center",
                  }}
                >
                  {dateRangeLabel}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            data-ocid="admin.loading_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 12,
              color: "#5c7aaa",
            }}
          >
            <Loader2
              style={{
                width: 36,
                height: 36,
                color: "#1a56db",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ margin: 0, fontWeight: 600, color: "#0f2d6e" }}>
              Loading repair requests...
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            data-ocid="admin.error_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
              border: "1px solid #fca5a5",
              borderRadius: "12px",
              backgroundColor: "#fff8f8",
            }}
          >
            <p style={{ color: "#dc2626", fontWeight: 600, margin: 0 }}>
              Failed to load repair requests.
            </p>
            <p style={{ color: "#5c7aaa", fontSize: "0.88rem", margin: 0 }}>
              {error}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              data-ocid="admin.retry_button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                backgroundColor: "#1a56db",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              Retry
            </button>
          </div>
        )}

        {/* Empty (no results after filter) */}
        {!loading &&
          !error &&
          (!filteredRequests || filteredRequests.length === 0) && (
            <div
              data-ocid="admin.empty_state"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                gap: 12,
                border: "1px solid #c7d8f5",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                color: "#5c7aaa",
              }}
            >
              <Inbox style={{ width: 48, height: 48, color: "#c7d8f5" }} />
              <p style={{ fontWeight: 700, color: "#0f2d6e", margin: 0 }}>
                {hasDateFilter
                  ? "No requests found for selected dates"
                  : "No repair requests yet"}
              </p>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>
                {hasDateFilter
                  ? "Try changing or clearing the date filter."
                  : "Bookings will appear here once customers submit the repair form."}
              </p>
              {hasDateFilter && (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  data-ocid="admin.date_filter.cancel_button"
                  style={{
                    padding: "7px 16px",
                    backgroundColor: "#1a56db",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredRequests &&
          filteredRequests.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #c7d8f5",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  data-ocid="admin.table"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#f0f4ff",
                        borderBottom: "1px solid #c7d8f5",
                      }}
                    >
                      {[
                        "#",
                        "Name",
                        "Phone",
                        "Email",
                        "Racket Brand",
                        "Damage Description",
                        "Date Submitted",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            color: "#5c7aaa",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req, i) => (
                      <tr
                        key={`${req.name}-${String(req.submissionTimestamp)}`}
                        data-ocid={`admin.row.${i + 1}`}
                        style={{ borderBottom: "1px solid #eef2ff" }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#5c7aaa",
                            fontSize: "0.82rem",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#0f2d6e",
                            fontWeight: 600,
                          }}
                        >
                          {req.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#0f2d6e" }}>
                          {req.phone}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#5c7aaa" }}>
                          {req.email}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              backgroundColor: "#e0eaff",
                              color: "#1a56db",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "999px",
                              border: "1px solid #c7d8f5",
                            }}
                          >
                            {req.racketBrand}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#0f2d6e",
                            maxWidth: 200,
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={req.damageDescription}
                          >
                            {req.damageDescription}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#5c7aaa",
                            fontSize: "0.82rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatTimestamp(req.submissionTimestamp)}
                        </td>
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              data-ocid={`admin.edit_button.${i + 1}`}
                              onClick={() => setEditTarget(req)}
                              title="Edit booking"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                                height: 32,
                                backgroundColor: "#e0eaff",
                                color: "#1a56db",
                                border: "1px solid #c7d8f5",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.delete_button.${i + 1}`}
                              onClick={() => setDeleteTarget(req)}
                              title="Delete booking"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                                height: 32,
                                backgroundColor: "#fff0f0",
                                color: "#dc2626",
                                border: "1px solid #fca5a5",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
