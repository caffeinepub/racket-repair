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
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Download,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { RepairRequest, StockItem, StockTransaction } from "../backend";
import { clearActorCache, getActor } from "../lib/actor";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  if (!ts) return "—";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusColor(s: string) {
  if (s === "Completed") return "bg-success text-success-foreground";
  if (s === "In Progress") return "bg-accent text-accent-foreground";
  return "bg-secondary text-secondary-foreground";
}

const SERVICE_TYPES = [
  "Restringing",
  "Frame Repair",
  "Grip Replacement",
  "Grommet Replacement",
  "Full Restoration",
  "Cricket Bat Repair",
  "Cricket Bat Handle",
  "Cricket Bat Binding",
  "Other",
];

const STRING_TYPES = [
  "Yonex BG 65",
  "Yonex BG Ti",
  "Yonex BG Power 80",
  "Yonex Ultimax 66",
  "Lining No 7",
  "Konex",
  "Vextor VBS 70",
  "N/A",
];

const PAYMENT_MODES = ["Phone Pay", "Card", "Cash"];
const STATUSES = ["Pending", "In Progress", "Completed"];
const CATEGORIES = ["Strings", "Grips", "Grommets", "Frames", "Tools", "Other"];
const UNITS = ["pcs", "rolls", "sets", "pairs"];

// ─── types ───────────────────────────────────────────────────────────────────

interface EditForm {
  name: string;
  email: string;
  phone: string;
  racketBrand: string;
  damageDescription: string;
  serviceType: string;
  stringType: string;
  paymentMode: string;
  status: string;
  numberOfRackets: string;
  charges: string;
}

// ServiceJob type (mirrors backend.did.d.ts)
interface ServiceJob {
  id: bigint;
  customerName: string;
  mobileNo: string;
  serviceType: string;
  charges: bigint;
  advance: bigint;
  paid: bigint;
  status: string;
  notes: string;
  timestamp: bigint;
}

interface ServiceJobForm {
  customerName: string;
  mobileNo: string;
  serviceType: string;
  charges: string;
  advance: string;
  paid: string;
  status: string;
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// AdminPage
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  function handleLogin() {
    if (loginUser === "admin" && loginPass === "racketfix2024") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password.");
    }
  }

  if (!loggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0f2644" }}
      >
        <div className="bg-white rounded-2xl shadow-hero p-8 w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-primary mb-1 text-center">
            RacketFix Admin
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Sign in to manage your dashboard
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-user">Username</Label>
              <Input
                id="admin-user"
                data-ocid="admin.input"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="admin-pass">Password</Label>
              <Input
                id="admin-pass"
                data-ocid="admin.input"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
            {loginError && (
              <p
                data-ocid="admin.error_state"
                className="text-destructive text-sm"
              >
                {loginError}
              </p>
            )}
            <Button
              data-ocid="admin.submit_button"
              className="w-full"
              style={{ background: "#1e3a5f" }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={() => setLoggedIn(false)} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard
// ═══════════════════════════════════════════════════════════════════════════

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [bookings, setBookings] = useState<RepairRequest[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockTxns, setStockTxns] = useState<StockTransaction[]>([]);
  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    clearActorCache();
    try {
      const actor = await getActor();
      const icActor = (actor as any).actor;
      const [rr, si, st, sj] = await Promise.all([
        actor.getAllRepairRequests(),
        actor.getStockItems(),
        actor.getStockTransactions(),
        icActor.getAllServiceJobs() as Promise<ServiceJob[]>,
      ]);
      rr.sort(
        (a, b) => Number(b.submissionTimestamp) - Number(a.submissionTimestamp),
      );
      sj.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setBookings(rr);
      setStockItems(si);
      setStockTxns(st);
      setServiceJobs(sj);
    } catch {
      setError("Failed to load data. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadData is stable
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* Header */}
      <header
        style={{ background: "#1e3a5f" }}
        className="text-white px-6 py-4 flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-xl font-bold">RacketFix Admin</h1>
          <p className="text-blue-200 text-xs mt-0.5">Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="admin.secondary_button"
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={loadData}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button
            data-ocid="admin.secondary_button"
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {loading && (
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center justify-center py-24 gap-3"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading data…</p>
        </div>
      )}

      {error && !loading && (
        <div
          data-ocid="admin.error_state"
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={loadData} data-ocid="admin.primary_button">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Bookings" value={bookings.length} />
            <StatCard
              label="Pending"
              value={bookings.filter((b) => b.status === "Pending").length}
            />
            <StatCard
              label="In Progress"
              value={bookings.filter((b) => b.status === "In Progress").length}
            />
            <StatCard
              label="Completed"
              value={bookings.filter((b) => b.status === "Completed").length}
            />
          </div>

          <Tabs defaultValue="repairs">
            <TabsList className="mb-4">
              <TabsTrigger data-ocid="admin.tab" value="repairs">
                Repair Requests
              </TabsTrigger>
              <TabsTrigger data-ocid="admin.tab" value="clients">
                Clients
              </TabsTrigger>
              <TabsTrigger data-ocid="admin.tab" value="restringing">
                Restringing
              </TabsTrigger>
              <TabsTrigger data-ocid="admin.tab" value="inventory">
                Inventory
              </TabsTrigger>
              <TabsTrigger data-ocid="admin.tab" value="servicejobs">
                Service Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repairs">
              <RepairsTab bookings={bookings} onRefresh={loadData} />
            </TabsContent>
            <TabsContent value="clients">
              <ClientsTab bookings={bookings} />
            </TabsContent>
            <TabsContent value="restringing">
              <RestringingTab bookings={bookings} />
            </TabsContent>
            <TabsContent value="inventory">
              <InventoryTab
                stockItems={stockItems}
                stockTxns={stockTxns}
                onRefresh={loadData}
              />
            </TabsContent>
            <TabsContent value="servicejobs">
              <ServiceJobsTab serviceJobs={serviceJobs} onRefresh={loadData} />
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-bold text-primary mt-1">{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Repairs Tab
// ═══════════════════════════════════════════════════════════════════════════

function RepairsTab({
  bookings,
  onRefresh,
}: { bookings: RepairRequest[]; onRefresh: () => void }) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editTarget, setEditTarget] = useState<RepairRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RepairRequest | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function filtered() {
    return bookings.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q);
      const ts = Number(b.submissionTimestamp) / 1_000_000;
      const d = new Date(ts);
      const matchFrom = !fromDate || d >= new Date(fromDate);
      const matchTo = !toDate || d <= new Date(`${toDate}T23:59:59`);
      return matchSearch && matchFrom && matchTo;
    });
  }

  function openEdit(b: RepairRequest) {
    setEditTarget(b);
    setEditForm({
      name: b.name,
      email: b.email,
      phone: b.phone,
      racketBrand: b.racketBrand,
      damageDescription: b.damageDescription,
      serviceType: b.serviceType,
      stringType: b.stringType,
      paymentMode: b.paymentMode,
      status: b.status,
      numberOfRackets: String(b.numberOfRackets),
      charges: b.charges,
    });
  }

  async function saveEdit() {
    if (!editTarget || !editForm) return;
    setSaving(true);
    try {
      const actor = await getActor();
      await actor.updateRepairRequest(
        editTarget.id,
        editForm.name,
        editForm.email,
        editForm.phone,
        editForm.racketBrand,
        editForm.damageDescription,
        editForm.serviceType,
        editForm.stringType,
        editForm.paymentMode,
        editForm.status,
        BigInt(editForm.numberOfRackets || "1"),
        editForm.charges,
      );
      setEditTarget(null);
      setEditForm(null);
      onRefresh();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const actor = await getActor();
      await actor.deleteRepairRequest(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch {
      alert("Failed to delete booking.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusChange(id: bigint, status: string) {
    try {
      const actor = await getActor();
      await actor.updateStatus(id, status);
      onRefresh();
    } catch {
      alert("Failed to update status.");
    }
  }

  function printStatement() {
    const rows = filtered();
    const dateHeader =
      fromDate && toDate
        ? `${fromDate} to ${toDate}`
        : fromDate
          ? `From ${fromDate}`
          : toDate
            ? `To ${toDate}`
            : "All Dates";

    const tableRows = rows
      .map(
        (b, i) =>
          `<tr style="background:${i % 2 === 0 ? "#f8fafd" : "white"}">
            <td>${formatDate(b.submissionTimestamp)}</td>
            <td>${b.name}</td>
            <td>${b.phone}</td>
            <td>${b.serviceType}</td>
            <td>${b.stringType || "—"}</td>
            <td>${b.paymentMode || "—"}</td>
            <td>${b.numberOfRackets}</td>
            <td>${b.status}</td>
            <td>${b.charges || "—"}</td>
          </tr>`,
      )
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>RacketFix Statement</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h2 { color: #1e3a5f; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { background:#1e3a5f; color:white; padding:8px 6px; text-align:left; }
        td { padding:6px; border-bottom:1px solid #e2e8f0; }
        .meta { color:#555; font-size:13px; margin-bottom:16px; }
      </style></head><body>
      <h2>RacketFix – Repair Statement</h2>
      <p class="meta">Date Range: <strong>${dateHeader}</strong> &nbsp;|&nbsp; Total Records: <strong>${rows.length}</strong></p>
      <table>
        <thead><tr>
          <th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>String</th><th>Payment</th><th>Rackets</th><th>Status</th><th>Charges</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      </body></html>`);
    win.document.close();
    win.print();
  }

  const rows = filtered();

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          data-ocid="repairs.search_input"
          placeholder="Search name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            From
          </Label>
          <Input
            data-ocid="repairs.input"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            To
          </Label>
          <Input
            data-ocid="repairs.input"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-36"
          />
        </div>
        <Button
          data-ocid="repairs.primary_button"
          size="sm"
          onClick={printStatement}
          style={{ background: "#1e3a5f" }}
          className="ml-auto"
        >
          <Printer className="h-4 w-4 mr-1" /> Print Statement
        </Button>
      </div>

      {rows.length === 0 ? (
        <div
          data-ocid="repairs.empty_state"
          className="text-center py-12 text-muted-foreground"
        >
          No repair requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>String</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Rackets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b, idx) => (
                <TableRow
                  key={String(b.id)}
                  data-ocid={`repairs.item.${idx + 1}`}
                >
                  <TableCell className="text-xs">
                    {formatDate(b.submissionTimestamp)}
                  </TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {b.serviceType || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {b.stringType || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {b.paymentMode || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {String(b.numberOfRackets)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={b.status}
                      onValueChange={(val) => handleStatusChange(b.id, val)}
                    >
                      <SelectTrigger
                        data-ocid="repairs.select"
                        className="h-7 text-xs w-32"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs">{b.charges || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        data-ocid={`repairs.edit_button.${idx + 1}`}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => openEdit(b)}
                      >
                        Edit
                      </Button>
                      <Button
                        data-ocid={`repairs.delete_button.${idx + 1}`}
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => setDeleteTarget(b)}
                      >
                        Del
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => {
          if (!o) {
            setEditTarget(null);
            setEditForm(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Repair Request</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-3 py-2">
              <FormRow label="Name">
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Phone">
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Email">
                <Input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Racket Brand">
                <Input
                  value={editForm.racketBrand}
                  onChange={(e) =>
                    setEditForm({ ...editForm, racketBrand: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Service Type">
                <Select
                  value={editForm.serviceType}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, serviceType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="String Type">
                <Select
                  value={editForm.stringType}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, stringType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STRING_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Payment Mode">
                <Select
                  value={editForm.paymentMode}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, paymentMode: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Status">
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Rackets">
                <Input
                  type="number"
                  min="1"
                  value={editForm.numberOfRackets}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      numberOfRackets: e.target.value,
                    })
                  }
                />
              </FormRow>
              <FormRow label="Charges">
                <Input
                  value={editForm.charges}
                  onChange={(e) =>
                    setEditForm({ ...editForm, charges: e.target.value })
                  }
                  placeholder="e.g. ₹500"
                />
              </FormRow>
              <FormRow label="Description">
                <Textarea
                  value={editForm.damageDescription}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      damageDescription: e.target.value,
                    })
                  }
                />
              </FormRow>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditTarget(null);
                setEditForm(null);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={saveEdit}
              style={{ background: "#1e3a5f" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repair Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the booking for{" "}
              <strong>{deleteTarget?.name}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="repairs.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="repairs.confirm_button"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FormRow({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <Label className="text-sm text-right">{label}</Label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Clients Tab
// ═══════════════════════════════════════════════════════════════════════════

function ClientsTab({ bookings }: { bookings: RepairRequest[] }) {
  const [search, setSearch] = useState("");
  const [historyClient, setHistoryClient] = useState<{
    name: string;
    phone: string;
    bookings: RepairRequest[];
  } | null>(null);

  const PREDEFINED_CLIENTS = [
    "Andhra sports",
    "Bharth sports",
    "Svs sports",
    "J h sports",
    "G r sports",
    "Anand sports",
  ];

  const clientMap = new Map<
    string,
    { name: string; phone: string; bookings: RepairRequest[] }
  >();
  // Seed predefined clients
  for (const name of PREDEFINED_CLIENTS) {
    clientMap.set(name.toLowerCase(), { name, phone: "—", bookings: [] });
  }
  for (const b of bookings) {
    const key = b.phone;
    if (!clientMap.has(key)) {
      clientMap.set(key, { name: b.name, phone: b.phone, bookings: [] });
    }
    clientMap.get(key)!.bookings.push(b);
  }
  const clients = Array.from(clientMap.values()).filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <Input
        data-ocid="clients.search_input"
        placeholder="Search name or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-56 mb-4"
      />
      {clients.length === 0 ? (
        <div
          data-ocid="clients.empty_state"
          className="text-center py-12 text-muted-foreground"
        >
          No clients found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Repairs</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((c, idx) => {
              const lastVisit = c.bookings.reduce((max, b) => {
                const t = Number(b.submissionTimestamp);
                return t > max ? t : max;
              }, 0);
              return (
                <TableRow key={c.phone} data-ocid={`clients.item.${idx + 1}`}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.bookings.length}</TableCell>
                  <TableCell className="text-xs">
                    {lastVisit ? formatDate(BigInt(lastVisit)) : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      data-ocid={`clients.secondary_button.${idx + 1}`}
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setHistoryClient(c)}
                    >
                      History <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={!!historyClient}
        onOpenChange={(o) => {
          if (!o) setHistoryClient(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Repair History – {historyClient?.name} ({historyClient?.phone})
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>String</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Charges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyClient?.bookings.map((b, i) => (
                <TableRow
                  key={String(b.id)}
                  data-ocid={`client_history.item.${i + 1}`}
                >
                  <TableCell className="text-xs">
                    {formatDate(b.submissionTimestamp)}
                  </TableCell>
                  <TableCell>{b.serviceType}</TableCell>
                  <TableCell className="text-xs">
                    {b.stringType || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                  </TableCell>
                  <TableCell>{b.charges || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Restringing Tab
// ═══════════════════════════════════════════════════════════════════════════

function RestringingTab({ bookings }: { bookings: RepairRequest[] }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const rows = bookings.filter((b) => {
    const isRestring = b.serviceType === "Restringing";
    const ts = Number(b.submissionTimestamp) / 1_000_000;
    const d = new Date(ts);
    const matchFrom = !fromDate || d >= new Date(fromDate);
    const matchTo = !toDate || d <= new Date(`${toDate}T23:59:59`);
    return isRestring && matchFrom && matchTo;
  });

  function printReport() {
    const dateHeader =
      fromDate && toDate
        ? `${fromDate} to ${toDate}`
        : fromDate
          ? `From ${fromDate}`
          : toDate
            ? `To ${toDate}`
            : "All Dates";
    const tableRows = rows
      .map(
        (b, i) =>
          `<tr style="background:${i % 2 === 0 ? "#f8fafd" : "white"}">
            <td>${formatDate(b.submissionTimestamp)}</td>
            <td>${b.name}</td>
            <td>${b.phone}</td>
            <td>${b.stringType || "—"}</td>
            <td>${b.paymentMode || "—"}</td>
            <td>${b.status}</td>
          </tr>`,
      )
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Restringing Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h2 { color: #1e3a5f; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { background:#1e3a5f; color:white; padding:8px 6px; text-align:left; }
        td { padding:6px; border-bottom:1px solid #e2e8f0; }
        .meta { color:#555; font-size:13px; margin-bottom:16px; }
      </style></head><body>
      <h2>RacketFix – Restringing Report</h2>
      <p class="meta">Date Range: <strong>${dateHeader}</strong> &nbsp;|&nbsp; Total: <strong>${rows.length}</strong></p>
      <table>
        <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>String Type</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      </body></html>`);
    win.document.close();
    win.print();
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input
            data-ocid="restringing.input"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            data-ocid="restringing.input"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-36"
          />
        </div>
        <Button
          data-ocid="restringing.primary_button"
          size="sm"
          onClick={printReport}
          style={{ background: "#1e3a5f" }}
          className="ml-auto"
        >
          <Printer className="h-4 w-4 mr-1" /> Print Report
        </Button>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Total restringing: <strong>{rows.length}</strong>
      </div>

      {rows.length === 0 ? (
        <div
          data-ocid="restringing.empty_state"
          className="text-center py-12 text-muted-foreground"
        >
          No restringing records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>String Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b, idx) => (
                <TableRow
                  key={String(b.id)}
                  data-ocid={`restringing.item.${idx + 1}`}
                >
                  <TableCell className="text-xs">
                    {formatDate(b.submissionTimestamp)}
                  </TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell>{b.stringType || "—"}</TableCell>
                  <TableCell>{b.paymentMode || "—"}</TableCell>
                  <TableCell>
                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Inventory Tab
// ═══════════════════════════════════════════════════════════════════════════

function InventoryTab({
  stockItems,
  stockTxns,
  onRefresh,
}: {
  stockItems: StockItem[];
  stockTxns: StockTransaction[];
  onRefresh: () => void;
}) {
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [txType, setTxType] = useState<"IN" | "OUT">("IN");
  const [txItemId, setTxItemId] = useState("");
  const [txQty, setTxQty] = useState("1");
  const [txNotes, setTxNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Strings",
    unit: "pcs",
  });

  function calcIn(itemId: bigint) {
    return stockTxns
      .filter((t) => t.itemId === itemId && t.txType === "IN")
      .reduce((s, t) => s + Number(t.quantity), 0);
  }

  function calcOut(itemId: bigint) {
    return stockTxns
      .filter((t) => t.itemId === itemId && t.txType === "OUT")
      .reduce((s, t) => s + Number(t.quantity), 0);
  }

  async function addItem() {
    if (!newItem.name.trim()) return;
    setSaving(true);
    try {
      const actor = await getActor();
      await actor.addStockItem(newItem.name, newItem.category, newItem.unit);
      setNewItem({ name: "", category: "Strings", unit: "pcs" });
      setAddItemOpen(false);
      onRefresh();
    } catch {
      alert("Failed to add item.");
    } finally {
      setSaving(false);
    }
  }

  async function recordTx() {
    if (!txItemId || !txQty) return;
    setSaving(true);
    try {
      const actor = await getActor();
      await actor.addStockTransaction(
        BigInt(txItemId),
        txType,
        BigInt(txQty),
        txNotes,
      );
      setTxOpen(false);
      setTxItemId("");
      setTxQty("1");
      setTxNotes("");
      onRefresh();
    } catch {
      alert("Failed to record transaction.");
    } finally {
      setSaving(false);
    }
  }

  async function quickTx(itemId: bigint, type: "IN" | "OUT") {
    try {
      const actor = await getActor();
      await actor.addStockTransaction(itemId, type, BigInt(1), "");
      onRefresh();
    } catch {
      alert("Failed.");
    }
  }

  function downloadCSV() {
    const header = "Item Name,Category,Unit,Total In,Total Out,Current Stock\n";
    const body = stockItems
      .map((item) => {
        const inQ = calcIn(item.id);
        const outQ = calcOut(item.id);
        const cur = inQ - outQ;
        return `"${item.name}","${item.category}","${item.unit}",${inQ},${outQ},${cur}`;
      })
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "racketfix-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function openTx(type: "IN" | "OUT", itemId?: bigint) {
    setTxType(type);
    setTxItemId(itemId ? String(itemId) : "");
    setTxOpen(true);
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          data-ocid="inventory.primary_button"
          size="sm"
          style={{ background: "#1e3a5f" }}
          onClick={() => setAddItemOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
        <Button
          data-ocid="inventory.primary_button"
          size="sm"
          className="bg-success text-success-foreground hover:bg-success/90"
          onClick={() => openTx("IN")}
        >
          Stock In
        </Button>
        <Button
          data-ocid="inventory.primary_button"
          size="sm"
          variant="destructive"
          onClick={() => openTx("OUT")}
        >
          Stock Out
        </Button>
        <Button
          data-ocid="inventory.secondary_button"
          size="sm"
          variant="outline"
          onClick={downloadCSV}
          className="ml-auto"
        >
          <Download className="h-4 w-4 mr-1" /> Download Excel
        </Button>
      </div>

      {stockItems.length === 0 ? (
        <div
          data-ocid="inventory.empty_state"
          className="text-center py-12 text-muted-foreground"
        >
          No stock items. Add your first item above.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-center">Total In</TableHead>
                <TableHead className="text-center">Total Out</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item, idx) => {
                const inQ = calcIn(item.id);
                const outQ = calcOut(item.id);
                const cur = inQ - outQ;
                return (
                  <TableRow
                    key={String(item.id)}
                    data-ocid={`inventory.item.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-center text-success">
                      {inQ}
                    </TableCell>
                    <TableCell className="text-center text-destructive">
                      {outQ}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {cur}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          data-ocid={`inventory.primary_button.${idx + 1}`}
                          size="sm"
                          className="h-7 text-xs bg-success text-success-foreground hover:bg-success/90"
                          onClick={() => quickTx(item.id, "IN")}
                        >
                          +1 IN
                        </Button>
                        <Button
                          data-ocid={`inventory.delete_button.${idx + 1}`}
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          onClick={() => quickTx(item.id, "OUT")}
                        >
                          -1 OUT
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Stock Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Item Name</Label>
              <Input
                data-ocid="inventory.input"
                className="mt-1"
                placeholder="e.g. BG65 String"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newItem.category}
                onValueChange={(v) => setNewItem({ ...newItem, category: v })}
              >
                <SelectTrigger data-ocid="inventory.select" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit</Label>
              <Select
                value={newItem.unit}
                onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
              >
                <SelectTrigger data-ocid="inventory.select" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={addItem}
              style={{ background: "#1e3a5f" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}{" "}
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Transaction Dialog */}
      <Dialog
        open={txOpen}
        onOpenChange={(o) => {
          if (!o) setTxOpen(false);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Stock {txType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Item</Label>
              <Select value={txItemId} onValueChange={setTxItemId}>
                <SelectTrigger data-ocid="inventory.select" className="mt-1">
                  <SelectValue placeholder="Select item…" />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map((i) => (
                    <SelectItem key={String(i.id)} value={String(i.id)}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                data-ocid="inventory.input"
                type="number"
                min="1"
                className="mt-1"
                value={txQty}
                onChange={(e) => setTxQty(e.target.value)}
              />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input
                data-ocid="inventory.input"
                className="mt-1"
                placeholder="e.g. Monthly restock"
                value={txNotes}
                onChange={(e) => setTxNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTxOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || !txItemId}
              onClick={recordTx}
              style={{ background: txType === "IN" ? "#1e6040" : "#8b1a1a" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Record {txType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Service Jobs Tab
// ═══════════════════════════════════════════════════════════════════════════

function ServiceJobsTab({
  serviceJobs,
  onRefresh,
}: {
  serviceJobs: ServiceJob[];
  onRefresh: () => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    customerName: "",
    mobileNo: "",
    serviceType: "Restringing",
    charges: "",
    advance: "",
    paid: "",
    notes: "",
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editTarget, setEditTarget] = useState<ServiceJob | null>(null);
  const [editForm, setEditForm] = useState<ServiceJobForm | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceJob | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function calcBalance(
    charges: string | bigint,
    advance: string | bigint,
    paid: string | bigint,
  ) {
    return Number(charges) - Number(advance) - Number(paid);
  }

  function filtered() {
    return serviceJobs.filter((job) => {
      const ts = Number(job.timestamp) / 1_000_000;
      const d = new Date(ts);
      const matchFrom = !fromDate || d >= new Date(fromDate);
      const matchTo = !toDate || d <= new Date(`${toDate}T23:59:59`);
      return matchFrom && matchTo;
    });
  }

  async function addJob() {
    if (!newJob.customerName.trim() || !newJob.mobileNo.trim()) return;
    setSaving(true);
    try {
      const backend = await getActor();
      const icActor = (backend as any).actor;
      await icActor.addServiceJob(
        newJob.customerName,
        newJob.mobileNo,
        newJob.serviceType || "Other",
        BigInt(newJob.charges || "0"),
        BigInt(newJob.advance || "0"),
        BigInt(newJob.paid || "0"),
        newJob.notes,
      );
      const charges = Number(newJob.charges || "0");
      const advance = Number(newJob.advance || "0");
      const paid = Number(newJob.paid || "0");
      const balance = charges - advance - paid;
      const mobile = newJob.mobileNo.replace(/\D/g, "");
      const waMsg = encodeURIComponent(
        `Dear ${newJob.customerName},\nYour service job at RacketFix is confirmed!\nService: ${newJob.serviceType || "Other"}\nTotal Charges: ₹${charges}\nAdvance Paid: ₹${advance}\nAmount Paid: ₹${paid}\nBalance Due: ₹${balance}\nContact us: 9440790818\nRacketFix, Visakhapatnam`,
      );
      window.open(`https://wa.me/91${mobile}?text=${waMsg}`, "_blank");
      setNewJob({
        customerName: "",
        mobileNo: "",
        serviceType: "Restringing",
        charges: "",
        advance: "",
        paid: "",
        notes: "",
      });
      setShowAddForm(false);
      onRefresh();
    } catch {
      alert("Failed to add service job.");
    } finally {
      setSaving(false);
    }
  }

  function sendWhatsApp(job: ServiceJob) {
    const mobile = job.mobileNo.replace(/\D/g, "");
    const balance = calcBalance(job.charges, job.advance, job.paid);
    const msg = encodeURIComponent(
      `Dear ${job.customerName},\nYour service job at RacketFix is confirmed!\nService: ${job.serviceType}\nTotal Charges: ₹${Number(job.charges)}\nAdvance Paid: ₹${Number(job.advance)}\nAmount Paid: ₹${Number(job.paid)}\nBalance Due: ₹${balance}\nStatus: ${job.status}\nContact us: 9440790818\nRacketFix, Visakhapatnam`,
    );
    window.open(`https://wa.me/91${mobile}?text=${msg}`, "_blank");
  }

  function openEdit(job: ServiceJob) {
    setEditTarget(job);
    setEditForm({
      customerName: job.customerName,
      mobileNo: job.mobileNo,
      serviceType: job.serviceType,
      charges: String(Number(job.charges)),
      advance: String(Number(job.advance)),
      paid: String(Number(job.paid)),
      status: job.status,
      notes: job.notes,
    });
  }

  async function saveEdit() {
    if (!editTarget || !editForm) return;
    setSaving(true);
    try {
      const backend = await getActor();
      const icActor = (backend as any).actor;
      await icActor.updateServiceJob(
        editTarget.id,
        editForm.customerName,
        editForm.mobileNo,
        editForm.serviceType,
        BigInt(editForm.charges || "0"),
        BigInt(editForm.advance || "0"),
        BigInt(editForm.paid || "0"),
        editForm.status,
        editForm.notes,
      );
      setEditTarget(null);
      setEditForm(null);
      onRefresh();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const backend = await getActor();
      const icActor = (backend as any).actor;
      await icActor.deleteServiceJob(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  function printReport() {
    const rows = filtered();
    const dateHeader =
      fromDate && toDate
        ? `${fromDate} to ${toDate}`
        : fromDate
          ? `From ${fromDate}`
          : toDate
            ? `To ${toDate}`
            : "All Dates";
    const tableRows = rows
      .map((j, i) => {
        const balance = calcBalance(j.charges, j.advance, j.paid);
        return `<tr style="background:${i % 2 === 0 ? "#f8fafd" : "white"}">
          <td>${formatDate(j.timestamp)}</td>
          <td>${j.customerName}</td>
          <td>${j.mobileNo}</td>
          <td>${j.serviceType}</td>
          <td>₹${Number(j.charges).toLocaleString("en-IN")}</td>
          <td>₹${Number(j.advance).toLocaleString("en-IN")}</td>
          <td>₹${Number(j.paid).toLocaleString("en-IN")}</td>
          <td style="color:${balance > 0 ? "red" : "green"}">₹${balance.toLocaleString("en-IN")}</td>
          <td>${j.status}</td>
        </tr>`;
      })
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>RacketFix – Service Jobs Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h2 { color: #1e3a5f; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { background:#1e3a5f; color:white; padding:8px 6px; text-align:left; }
        td { padding:6px; border-bottom:1px solid #e2e8f0; }
        .meta { color:#555; font-size:13px; margin-bottom:16px; }
      </style></head><body>
      <h2>RacketFix – Service Jobs Report</h2>
      <p class="meta">Date Range: <strong>${dateHeader}</strong> &nbsp;|&nbsp; Total: <strong>${rows.length}</strong></p>
      <table>
        <thead><tr>
          <th>Date</th><th>Customer</th><th>Mobile</th><th>Service</th>
          <th>Charges</th><th>Advance</th><th>Paid</th><th>Balance</th><th>Status</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      </body></html>`);
    win.document.close();
    win.print();
  }

  const rows = filtered();
  const totalCharges = serviceJobs.reduce(
    (sum, j) => sum + Number(j.charges),
    0,
  );
  const totalBalance = serviceJobs.reduce(
    (sum, j) => sum + calcBalance(j.charges, j.advance, j.paid),
    0,
  );
  const newJobBalance = calcBalance(
    newJob.charges,
    newJob.advance,
    newJob.paid,
  );
  const editBalance = editForm
    ? calcBalance(editForm.charges, editForm.advance, editForm.paid)
    : 0;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Total Jobs
          </p>
          <p className="text-3xl font-bold text-primary mt-1">
            {serviceJobs.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Total Charges
          </p>
          <p className="text-3xl font-bold text-primary mt-1">
            ₹{totalCharges.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Total Balance Due
          </p>
          <p
            className={`text-3xl font-bold mt-1 ${totalBalance > 0 ? "text-destructive" : "text-success"}`}
          >
            ₹{totalBalance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary text-base">Service Jobs</h3>
          <Button
            data-ocid="servicejobs.open_modal_button"
            size="sm"
            style={{ background: "#1e3a5f" }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {showAddForm ? "Cancel" : "Add Service Job"}
          </Button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="border rounded-lg p-4 mb-4 bg-slate-50">
            <h4 className="font-medium mb-3 text-sm text-primary">
              New Service Job
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Customer Name *</Label>
                <Input
                  data-ocid="servicejobs.input"
                  className="mt-1"
                  placeholder="Customer name"
                  value={newJob.customerName}
                  onChange={(e) =>
                    setNewJob({ ...newJob, customerName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Mobile No *</Label>
                <Input
                  data-ocid="servicejobs.input"
                  className="mt-1"
                  placeholder="10-digit mobile number"
                  value={newJob.mobileNo}
                  onChange={(e) =>
                    setNewJob({ ...newJob, mobileNo: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Type of Service</Label>
                <Select
                  value={newJob.serviceType}
                  onValueChange={(v) =>
                    setNewJob({ ...newJob, serviceType: v })
                  }
                >
                  <SelectTrigger
                    data-ocid="servicejobs.select"
                    className="mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Charges (₹)</Label>
                <Input
                  data-ocid="servicejobs.input"
                  type="number"
                  min="0"
                  className="mt-1"
                  placeholder="0"
                  value={newJob.charges}
                  onChange={(e) =>
                    setNewJob({ ...newJob, charges: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Advance (₹)</Label>
                <Input
                  data-ocid="servicejobs.input"
                  type="number"
                  min="0"
                  className="mt-1"
                  placeholder="0"
                  value={newJob.advance}
                  onChange={(e) =>
                    setNewJob({ ...newJob, advance: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Paid (₹)</Label>
                <Input
                  data-ocid="servicejobs.input"
                  type="number"
                  min="0"
                  className="mt-1"
                  placeholder="0"
                  value={newJob.paid}
                  onChange={(e) =>
                    setNewJob({ ...newJob, paid: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Balance Due (₹)</Label>
                <div
                  className={`mt-1 px-3 py-2 rounded border text-sm font-semibold ${
                    newJobBalance > 0
                      ? "text-destructive border-destructive/30 bg-destructive/5"
                      : "text-success border-success/30 bg-success/5"
                  }`}
                >
                  ₹{newJobBalance}
                </div>
              </div>
              <div>
                <Label className="text-xs">Notes (optional)</Label>
                <Input
                  data-ocid="servicejobs.input"
                  className="mt-1"
                  placeholder="Optional notes"
                  value={newJob.notes}
                  onChange={(e) =>
                    setNewJob({ ...newJob, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                data-ocid="servicejobs.submit_button"
                disabled={
                  saving ||
                  !newJob.customerName.trim() ||
                  !newJob.mobileNo.trim()
                }
                onClick={addJob}
                style={{ background: "#1e3a5f" }}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Job
              </Button>
            </div>
          </div>
        )}

        {/* Date filter + Print */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              From
            </Label>
            <Input
              data-ocid="servicejobs.input"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              To
            </Label>
            <Input
              data-ocid="servicejobs.input"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-36"
            />
          </div>
          <Button
            data-ocid="servicejobs.primary_button"
            size="sm"
            onClick={printReport}
            style={{ background: "#1e3a5f" }}
            className="ml-auto"
          >
            <Printer className="h-4 w-4 mr-1" /> Print Report
          </Button>
        </div>

        {/* Jobs table */}
        {rows.length === 0 ? (
          <div
            data-ocid="servicejobs.empty_state"
            className="text-center py-12 text-muted-foreground"
          >
            No service jobs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Charges</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((job, idx) => {
                  const balance = calcBalance(
                    job.charges,
                    job.advance,
                    job.paid,
                  );
                  return (
                    <TableRow
                      key={String(job.id)}
                      data-ocid={`servicejobs.item.${idx + 1}`}
                    >
                      <TableCell className="text-xs">
                        {formatDate(job.timestamp)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {job.customerName}
                      </TableCell>
                      <TableCell>{job.mobileNo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {job.serviceType || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ₹{Number(job.charges).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        ₹{Number(job.advance).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        ₹{Number(job.paid).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell
                        className={
                          balance > 0
                            ? "text-destructive font-semibold"
                            : "text-success font-semibold"
                        }
                      >
                        ₹{balance.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            data-ocid={`servicejobs.primary_button.${idx + 1}`}
                            size="sm"
                            className="h-7 text-xs bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => sendWhatsApp(job)}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" /> WA
                          </Button>
                          <Button
                            data-ocid={`servicejobs.edit_button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => openEdit(job)}
                          >
                            Edit
                          </Button>
                          <Button
                            data-ocid={`servicejobs.delete_button.${idx + 1}`}
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => setDeleteTarget(job)}
                          >
                            Del
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => {
          if (!o) {
            setEditTarget(null);
            setEditForm(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service Job</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-3 py-2">
              <FormRow label="Customer Name">
                <Input
                  value={editForm.customerName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, customerName: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Mobile No">
                <Input
                  value={editForm.mobileNo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobileNo: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Service Type">
                <Select
                  value={editForm.serviceType}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, serviceType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Charges (₹)">
                <Input
                  type="number"
                  min="0"
                  value={editForm.charges}
                  onChange={(e) =>
                    setEditForm({ ...editForm, charges: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Advance (₹)">
                <Input
                  type="number"
                  min="0"
                  value={editForm.advance}
                  onChange={(e) =>
                    setEditForm({ ...editForm, advance: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Paid (₹)">
                <Input
                  type="number"
                  min="0"
                  value={editForm.paid}
                  onChange={(e) =>
                    setEditForm({ ...editForm, paid: e.target.value })
                  }
                />
              </FormRow>
              <FormRow label="Balance (₹)">
                <div
                  className={`px-3 py-2 rounded border text-sm font-semibold ${
                    editBalance > 0
                      ? "text-destructive border-destructive/30 bg-destructive/5"
                      : "text-success border-success/30 bg-success/5"
                  }`}
                >
                  ₹{editBalance.toLocaleString("en-IN")}
                </div>
              </FormRow>
              <FormRow label="Status">
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Notes">
                <Input
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Optional notes"
                />
              </FormRow>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditTarget(null);
                setEditForm(null);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={saveEdit}
              style={{ background: "#1e3a5f" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service job for{" "}
              <strong>{deleteTarget?.customerName}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="servicejobs.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="servicejobs.confirm_button"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
