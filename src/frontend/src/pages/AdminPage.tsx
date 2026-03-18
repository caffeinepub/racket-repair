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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddStockItem,
  useAddStockTransaction,
  useDeleteRepair,
  useDeleteStockItem,
  useDeleteStockTransaction,
  useRepairRequests,
  useStockItems,
  useStockTransactions,
  useUpdateRepair,
  useUpdateStatus,
} from "@/hooks/useQueries";
import {
  BarChart3,
  ClipboardList,
  Download,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Printer,
  RefreshCw,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { StockItem, StockTransaction } from "../backend";
import type { RepairRequest } from "../backend";

const ADMIN_USER = "admin";
const ADMIN_PASS = "racketfix2024";
const SESSION_KEY = "racketfix_admin";

const SERVICE_TYPES = [
  "Restringing",
  "Frame Repair",
  "Grip Replacement",
  "Grommet Replacement",
  "Full Restoration",
  "Other",
  "Cricket Bat Repair",
  "Cricket Bat Handle",
  "Cricket Bat Binding",
];
const STRING_TYPES = [
  "Yonex BG 65",
  "Yonex BG Ti",
  "Yonex BG Power 80",
  "Yonex Ulimax 66",
  "Lining N0 7",
  "Konex",
  "Vextor VBS 70",
];
const PAYMENT_MODES = ["Phone Pay", "Card", "Cash"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const STOCK_CATEGORIES = [
  "Strings",
  "Grips",
  "Grommets",
  "Frames",
  "Tools",
  "Other",
];
const STOCK_UNITS = ["pcs", "rolls", "sets", "pairs"];

function formatDate(ts: bigint) {
  const d = new Date(Number(ts) / 1_000_000);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusColor(s: string) {
  if (s === "Completed") return "bg-success text-success-foreground";
  if (s === "In Progress") return "bg-accent text-accent-foreground";
  return "bg-muted text-muted-foreground";
}

function serviceColor(s: string) {
  if (s === "Restringing")
    return "bg-primary/10 text-primary border-primary/20";
  if (s.startsWith("Cricket"))
    return "bg-accent/10 text-accent border-accent/20";
  return "bg-muted text-muted-foreground border-border";
}

function inDateRange(ts: bigint, from: string, to: string) {
  if (!from && !to) return true;
  const d = new Date(Number(ts) / 1_000_000);
  const df = from ? new Date(from) : null;
  const dt = to ? new Date(`${to}T23:59:59`) : null;
  if (df && d < df) return false;
  if (dt && d > dt) return false;
  return true;
}

type EditForm = {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  racketBrand: string;
  damageDescription: string;
  serviceType: string;
  stringType: string;
  paymentMode: string;
  status: string;
  numberOfRackets: number;
  charges: string;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === ADMIN_USER && loginForm.pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border shadow-card p-8 w-full max-w-sm"
          data-ocid="admin_login.panel"
        >
          <div className="text-center mb-6">
            <span className="text-4xl">🏸</span>
            <h1 className="font-display text-2xl font-bold text-foreground mt-2">
              RacketFix Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage repairs
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-user">Username</Label>
              <Input
                id="admin-user"
                value={loginForm.user}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, user: e.target.value }))
                }
                placeholder="admin"
                style={{ backgroundColor: "#fff" }}
                data-ocid="admin_login.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-pass">Password</Label>
              <Input
                id="admin-pass"
                type="password"
                value={loginForm.pass}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, pass: e.target.value }))
                }
                placeholder="••••••••"
                style={{ backgroundColor: "#fff" }}
                data-ocid="admin_login.input"
              />
            </div>
            {loginError && (
              <p
                className="text-sm text-destructive"
                data-ocid="admin_login.error_state"
              >
                {loginError}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin_login.submit_button"
            >
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useRepairRequests();
  const updateStatus = useUpdateStatus();
  const updateRepair = useUpdateRepair();
  const deleteRepair = useDeleteRepair();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editItem, setEditItem] = useState<EditForm | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [clientView, setClientView] = useState<string | null>(null);

  const [restrFrom, setRestrFrom] = useState("");
  const [restrTo, setRestrTo] = useState("");

  const now = new Date();
  const monthStart =
    new Date(now.getFullYear(), now.getMonth(), 1).getTime() * 1_000_000;

  const stats = useMemo(
    () => ({
      total: requests.length,
      clients: new Set(requests.map((r) => r.phone)).size,
      thisMonth: requests.filter(
        (r) => r.submissionTimestamp >= BigInt(monthStart),
      ).length,
    }),
    [requests, monthStart],
  );

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q || r.name.toLowerCase().includes(q) || r.phone.includes(q);
        return (
          matchSearch && inDateRange(r.submissionTimestamp, fromDate, toDate)
        );
      }),
    [requests, search, fromDate, toDate],
  );

  const restrFiltered = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.serviceType === "Restringing" &&
          inDateRange(r.submissionTimestamp, restrFrom, restrTo),
      ),
    [requests, restrFrom, restrTo],
  );

  const clients = useMemo(() => {
    const map = new Map<
      string,
      { name: string; phone: string; total: number; lastVisit: bigint }
    >();
    for (const r of requests) {
      const existing = map.get(r.phone);
      if (!existing) {
        map.set(r.phone, {
          name: r.name,
          phone: r.phone,
          total: 1,
          lastVisit: r.submissionTimestamp,
        });
      } else {
        existing.total++;
        if (r.submissionTimestamp > existing.lastVisit)
          existing.lastVisit = r.submissionTimestamp;
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => Number(b.lastVisit) - Number(a.lastVisit),
    );
  }, [requests]);

  const clientHistory = clientView
    ? requests.filter((r) => r.phone === clientView)
    : [];

  const handleStatusChange = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleChargesBlur = async (r: RepairRequest, charges: string) => {
    if (charges === r.charges) return;
    try {
      await updateRepair.mutateAsync({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        racketBrand: r.racketBrand,
        damageDescription: r.damageDescription,
        serviceType: r.serviceType,
        stringType: r.stringType,
        paymentMode: r.paymentMode,
        status: r.status,
        numberOfRackets: r.numberOfRackets,
        charges,
      });
      toast.success("Charges updated");
    } catch {
      toast.error("Failed to update charges");
    }
  };

  const openEdit = (r: RepairRequest) => {
    setEditItem({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      racketBrand: r.racketBrand,
      damageDescription: r.damageDescription,
      serviceType: r.serviceType,
      stringType: r.stringType,
      paymentMode: r.paymentMode,
      status: r.status,
      numberOfRackets: Number(r.numberOfRackets),
      charges: r.charges,
    });
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      await updateRepair.mutateAsync({
        ...editItem,
        numberOfRackets: BigInt(editItem.numberOfRackets),
      });
      toast.success("Booking updated");
      setEditItem(null);
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteRepair.mutateAsync(deleteId);
      toast.success("Booking deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const printReport = (
    rows: RepairRequest[],
    title: string,
    dateRange: string,
  ) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const html = `<!DOCTYPE html><html><head><title>${title}</title>
      <style>body{font-family:sans-serif;padding:20px}h2{margin-bottom:4px}p.sub{color:#666;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px 8px;font-size:12px;text-align:left}
      th{background:#f0f0f0;font-weight:600}tr:nth-child(even){background:#fafafa}
      @media print{button{display:none}}</style></head>
      <body>
      <h2>RacketFix — ${title}</h2>
      <p class="sub">${dateRange} | Total: ${rows.length}</p>
      <button onclick="window.print()" style="margin-bottom:12px;padding:6px 16px;cursor:pointer">Print</button>
      <table><thead><tr>
      <th>#</th><th>Date</th><th>Name</th><th>Phone</th><th>Brand</th><th>Service</th><th>String</th><th>Qty</th><th>Payment</th><th>Charges</th><th>Status</th>
      </tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${formatDate(r.submissionTimestamp)}</td><td>${r.name}</td><td>${r.phone}</td><td>${r.racketBrand}</td><td>${r.serviceType}</td><td>${r.stringType || "—"}</td><td>${r.numberOfRackets}</td><td>${r.paymentMode || "—"}</td><td>${r.charges || "—"}</td><td>${r.status}</td></tr>`).join("")}
      </tbody></table></body></html>`;
    win.document.write(html);
    win.document.close();
  };

  const dateRangeLabel = (from: string, to: string) =>
    from || to ? `${from || "Start"} to ${to || "End"}` : "All Dates";

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-muted flex flex-col items-center justify-center gap-4"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading repair data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen bg-muted flex flex-col items-center justify-center gap-4"
        data-ocid="admin.error_state"
      >
        <p className="text-destructive font-semibold">
          Failed to load repair data
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          data-ocid="admin.button"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏸</span>
            <span className="font-display font-bold text-lg text-primary">
              RacketFix
            </span>
            <Badge variant="secondary" className="ml-1">
              Admin
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            data-ocid="admin.button"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Bookings",
              value: stats.total,
              icon: <ClipboardList className="w-5 h-5" />,
            },
            {
              label: "Unique Clients",
              value: stats.clients,
              icon: <Users className="w-5 h-5" />,
            },
            {
              label: "This Month",
              value: stats.thisMonth,
              icon: <BarChart3 className="w-5 h-5" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-border shadow-card p-5 flex items-center gap-4"
            >
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList
            className="bg-white border border-border"
            data-ocid="admin.tab"
          >
            <TabsTrigger value="requests" data-ocid="admin.tab">
              Repair Requests
            </TabsTrigger>
            <TabsTrigger value="clients" data-ocid="admin.tab">
              Clients
            </TabsTrigger>
            <TabsTrigger value="restringing" data-ocid="admin.tab">
              Restringing
            </TabsTrigger>
            <TabsTrigger value="inventory" data-ocid="admin.tab">
              <Package className="w-4 h-4 mr-1.5" />
              Inventory
            </TabsTrigger>
          </TabsList>

          {/* Repair Requests Tab */}
          <TabsContent value="requests">
            <div className="bg-white rounded-xl border border-border shadow-card">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 no-print">
                <Input
                  placeholder="Search name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                  style={{ backgroundColor: "#fff" }}
                  data-ocid="admin.search_input"
                />
                <div className="flex gap-2 items-center">
                  <Label className="text-xs whitespace-nowrap">From</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-36"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <Label className="text-xs whitespace-nowrap">To</Label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-36"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      printReport(
                        filtered,
                        "Repair Requests",
                        dateRangeLabel(fromDate, toDate),
                      )
                    }
                    data-ocid="admin.button"
                  >
                    <Printer className="w-4 h-4 mr-1" /> Print
                  </Button>
                </div>
              </div>
              {filtered.length === 0 ? (
                <div
                  className="p-12 text-center text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No repair requests found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {[
                          "#",
                          "Date",
                          "Name",
                          "Phone",
                          "Brand",
                          "Service",
                          "String",
                          "Qty",
                          "Status",
                          "Charges",
                          "Payment",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((r, i) => (
                        <RepairRow
                          key={String(r.id)}
                          r={r}
                          index={i + 1}
                          onStatusChange={handleStatusChange}
                          onChargesBlur={handleChargesBlur}
                          onEdit={openEdit}
                          onDelete={(id) => setDeleteId(id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="bg-white rounded-xl border border-border shadow-card">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Client List ({clients.length})
                </h3>
              </div>
              {clients.length === 0 ? (
                <div
                  className="p-12 text-center text-muted-foreground"
                  data-ocid="clients.empty_state"
                >
                  No clients yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {[
                          "#",
                          "Name",
                          "Phone",
                          "Total Repairs",
                          "Last Visit",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {clients.map((c, i) => (
                        <tr
                          key={c.phone}
                          className="hover:bg-muted/40 transition-colors"
                          data-ocid={`clients.item.${i + 1}`}
                        >
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2.5 font-medium text-foreground">
                            {c.name}
                          </td>
                          <td className="px-3 py-2.5">{c.phone}</td>
                          <td className="px-3 py-2.5">
                            <Badge variant="secondary">
                              {c.total} repair{c.total !== 1 ? "s" : ""}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {formatDate(c.lastVisit)}
                          </td>
                          <td className="px-3 py-2.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setClientView(c.phone)}
                              data-ocid={`clients.secondary_button.${i + 1}`}
                            >
                              View History
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Restringing Tab */}
          <TabsContent value="restringing">
            <div className="bg-white rounded-xl border border-border shadow-card">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 items-center">
                  <Label className="text-xs whitespace-nowrap">From</Label>
                  <Input
                    type="date"
                    value={restrFrom}
                    onChange={(e) => setRestrFrom(e.target.value)}
                    className="w-36"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <Label className="text-xs whitespace-nowrap">To</Label>
                  <Input
                    type="date"
                    value={restrTo}
                    onChange={(e) => setRestrTo(e.target.value)}
                    className="w-36"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      printReport(
                        restrFiltered,
                        "Restringing Report",
                        dateRangeLabel(restrFrom, restrTo),
                      )
                    }
                    data-ocid="restringing.button"
                  >
                    <Printer className="w-4 h-4 mr-1" /> Print
                  </Button>
                </div>
                <div className="ml-auto text-sm text-muted-foreground self-center">
                  {restrFiltered.length} restringing job
                  {restrFiltered.length !== 1 ? "s" : ""}
                </div>
              </div>
              {restrFiltered.length === 0 ? (
                <div
                  className="p-12 text-center text-muted-foreground"
                  data-ocid="restringing.empty_state"
                >
                  No restringing jobs found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {[
                          "#",
                          "Date",
                          "Name",
                          "Phone",
                          "Brand",
                          "String Type",
                          "Qty",
                          "Payment Mode",
                          "Charges",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {restrFiltered.map((r, i) => (
                        <tr
                          key={String(r.id)}
                          className="hover:bg-muted/40 transition-colors"
                          data-ocid={`restringing.item.${i + 1}`}
                        >
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            {formatDate(r.submissionTimestamp)}
                          </td>
                          <td className="px-3 py-2.5 font-medium">{r.name}</td>
                          <td className="px-3 py-2.5">{r.phone}</td>
                          <td className="px-3 py-2.5">{r.racketBrand}</td>
                          <td className="px-3 py-2.5">{r.stringType || "—"}</td>
                          <td className="px-3 py-2.5">
                            {String(r.numberOfRackets)}
                          </td>
                          <td className="px-3 py-2.5">
                            {r.paymentMode || "—"}
                          </td>
                          <td className="px-3 py-2.5">{r.charges || "—"}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(r.status)}`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Edit Booking</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem((f) => f && { ...f, name: e.target.value })
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={editItem.phone}
                  onChange={(e) =>
                    setEditItem((f) => f && { ...f, phone: e.target.value })
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={editItem.email}
                  onChange={(e) =>
                    setEditItem((f) => f && { ...f, email: e.target.value })
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Input
                  value={editItem.racketBrand}
                  onChange={(e) =>
                    setEditItem(
                      (f) => f && { ...f, racketBrand: e.target.value },
                    )
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={editItem.numberOfRackets}
                  onChange={(e) =>
                    setEditItem(
                      (f) =>
                        f && {
                          ...f,
                          numberOfRackets: Number.parseInt(e.target.value) || 1,
                        },
                    )
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Charges (₹)</Label>
                <Input
                  value={editItem.charges}
                  onChange={(e) =>
                    setEditItem((f) => f && { ...f, charges: e.target.value })
                  }
                  placeholder="e.g. 350"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Service Type</Label>
                <Select
                  value={editItem.serviceType}
                  onValueChange={(v) =>
                    setEditItem((f) => f && { ...f, serviceType: v })
                  }
                >
                  <SelectTrigger style={{ backgroundColor: "#fff" }}>
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
              <div className="space-y-1.5">
                <Label>String Type</Label>
                <Select
                  value={editItem.stringType}
                  onValueChange={(v) =>
                    setEditItem((f) => f && { ...f, stringType: v })
                  }
                >
                  <SelectTrigger style={{ backgroundColor: "#fff" }}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {STRING_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Payment Mode</Label>
                <Select
                  value={editItem.paymentMode}
                  onValueChange={(v) =>
                    setEditItem((f) => f && { ...f, paymentMode: v })
                  }
                >
                  <SelectTrigger style={{ backgroundColor: "#fff" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={editItem.status}
                  onValueChange={(v) =>
                    setEditItem((f) => f && { ...f, status: v })
                  }
                >
                  <SelectTrigger style={{ backgroundColor: "#fff" }}>
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
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label>Damage Description</Label>
                <Textarea
                  value={editItem.damageDescription}
                  rows={3}
                  onChange={(e) =>
                    setEditItem(
                      (f) => f && { ...f, damageDescription: e.target.value },
                    )
                  }
                  style={{ backgroundColor: "#fff" }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditItem(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={updateRepair.isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.save_button"
            >
              {updateRepair.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Booking</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRepair.isPending}
              data-ocid="admin.confirm_button"
            >
              {deleteRepair.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client History Dialog */}
      <Dialog
        open={!!clientView}
        onOpenChange={(open) => !open && setClientView(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="clients.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Repair History</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {clientHistory.map((r, i) => (
              <div
                key={String(r.id)}
                className="border border-border rounded-lg p-3 text-sm"
                data-ocid={`clients.item.${i + 1}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold">{r.serviceType}</span>
                    {r.stringType && (
                      <span className="text-muted-foreground ml-2">
                        ({r.stringType})
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(r.status)}`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">
                  {r.racketBrand} · Qty {String(r.numberOfRackets)} ·{" "}
                  {formatDate(r.submissionTimestamp)}
                </p>
                {r.charges && (
                  <p className="text-primary font-semibold mt-0.5">
                    ₹{r.charges}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClientView(null)}
              data-ocid="clients.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Inventory Tab ----

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function downloadInventoryCSV(
  items: StockItem[],
  transactions: StockTransaction[],
) {
  const itemMap = new Map(items.map((it) => [String(it.id), it]));

  // Sort transactions by timestamp ascending for running balance
  const sorted = [...transactions].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );

  // Running balance per item
  const balances: Record<string, number> = {};

  const rows = sorted.map((tx) => {
    const item = itemMap.get(String(tx.itemId));
    const itemName = item?.name ?? "Unknown";
    const category = item?.category ?? "";
    const unit = item?.unit ?? "";
    const key = String(tx.itemId);
    if (!balances[key]) balances[key] = 0;
    const qty = Number(tx.quantity);
    if (tx.txType === "IN") {
      balances[key] += qty;
    } else {
      balances[key] -= qty;
    }
    const d = new Date(Number(tx.timestamp) / 1_000_000);
    const dateStr = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return [
      csvEscape(dateStr),
      csvEscape(itemName),
      csvEscape(category),
      csvEscape(unit),
      csvEscape(tx.txType),
      String(qty),
      csvEscape(tx.notes),
      String(balances[key]),
    ].join(",");
  });

  const header = "Date,Item Name,Category,Unit,Type,Quantity,Notes,Balance";
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `inventory-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function InventoryTab() {
  const { data: items = [], isLoading: itemsLoading } = useStockItems();
  const { data: transactions = [], isLoading: txLoading } =
    useStockTransactions();
  const addItem = useAddStockItem();
  const addTx = useAddStockTransaction();
  const deleteItem = useDeleteStockItem();
  const deleteTx = useDeleteStockTransaction();

  // Add Item dialog
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "",
    category: "Strings",
    unit: "pcs",
  });

  // Record Transaction dialog
  const [addTxOpen, setAddTxOpen] = useState(false);
  const [txForm, setTxForm] = useState({
    itemId: "",
    txType: "IN",
    quantity: "1",
    notes: "",
  });

  // Delete item confirm
  const [deleteItemId, setDeleteItemId] = useState<bigint | null>(null);

  // Transactions date filter
  const [txFrom, setTxFrom] = useState("");
  const [txTo, setTxTo] = useState("");

  // Computed: current stock per item
  const stockMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const tx of transactions) {
      const key = String(tx.itemId);
      if (!m[key]) m[key] = 0;
      if (tx.txType === "IN") m[key] += Number(tx.quantity);
      else m[key] -= Number(tx.quantity);
    }
    return m;
  }, [transactions]);

  const totalIn = useMemo(
    () =>
      transactions
        .filter((t) => t.txType === "IN")
        .reduce((s, t) => s + Number(t.quantity), 0),
    [transactions],
  );
  const totalOut = useMemo(
    () =>
      transactions
        .filter((t) => t.txType === "OUT")
        .reduce((s, t) => s + Number(t.quantity), 0),
    [transactions],
  );

  const itemMap = useMemo(
    () => new Map(items.map((it) => [String(it.id), it])),
    [items],
  );

  const filteredTx = useMemo(
    () =>
      transactions
        .filter((tx) => inDateRange(tx.timestamp, txFrom, txTo))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
    [transactions, txFrom, txTo],
  );

  const handleAddItem = async () => {
    if (!itemForm.name.trim()) return;
    try {
      await addItem.mutateAsync(itemForm);
      toast.success("Item added");
      setItemForm({ name: "", category: "Strings", unit: "pcs" });
      setAddItemOpen(false);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleAddTx = async () => {
    if (!txForm.itemId || !txForm.quantity) return;
    try {
      await addTx.mutateAsync({
        itemId: BigInt(txForm.itemId),
        txType: txForm.txType,
        quantity: BigInt(Number.parseInt(txForm.quantity) || 1),
        notes: txForm.notes,
      });
      toast.success("Transaction recorded");
      setTxForm({ itemId: "", txType: "IN", quantity: "1", notes: "" });
      setAddTxOpen(false);
    } catch {
      toast.error("Failed to record transaction");
    }
  };

  const handleDeleteItem = async () => {
    if (deleteItemId === null) return;
    try {
      await deleteItem.mutateAsync(deleteItemId);
      toast.success("Item deleted");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleDeleteTx = async (id: bigint) => {
    try {
      await deleteTx.mutateAsync(id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  const isLoading = itemsLoading || txLoading;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-card p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-card p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalIn}</p>
            <p className="text-sm text-muted-foreground">Total IN</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-card p-5 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg text-red-600">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalOut}</p>
            <p className="text-sm text-muted-foreground">Total OUT</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-border shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground">Stock Items</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setAddTxOpen(true)}
              variant="outline"
              data-ocid="inventory.secondary_button"
            >
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Record Transaction
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAddItemOpen(true)}
              data-ocid="inventory.primary_button"
            >
              + Add Item
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div
            className="p-10 flex justify-center"
            data-ocid="inventory.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div
            className="p-12 text-center text-muted-foreground"
            data-ocid="inventory.empty_state"
          >
            No stock items yet. Click "+ Add Item" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {[
                    "#",
                    "Item Name",
                    "Category",
                    "Unit",
                    "Current Stock",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, i) => {
                  const stock = stockMap[String(item.id)] ?? 0;
                  return (
                    <tr
                      key={String(item.id)}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`inventory.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2.5 font-medium">{item.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {item.unit}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`font-semibold ${
                            stock < 0
                              ? "text-destructive"
                              : stock === 0
                                ? "text-muted-foreground"
                                : "text-green-700"
                          }`}
                        >
                          {stock} {item.unit}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => {
                              setTxForm((f) => ({
                                ...f,
                                itemId: String(item.id),
                              }));
                              setAddTxOpen(true);
                            }}
                            data-ocid={`inventory.secondary_button.${i + 1}`}
                          >
                            + Transaction
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteItemId(item.id)}
                            data-ocid={`inventory.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Log */}
      <div className="bg-white rounded-xl border border-border shadow-card">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <h3 className="font-semibold text-foreground">Transaction Log</h3>
          <div className="flex gap-2 items-center sm:ml-4">
            <Label className="text-xs whitespace-nowrap">From</Label>
            <Input
              type="date"
              value={txFrom}
              onChange={(e) => setTxFrom(e.target.value)}
              className="w-36"
              style={{ backgroundColor: "#fff" }}
            />
            <Label className="text-xs whitespace-nowrap">To</Label>
            <Input
              type="date"
              value={txTo}
              onChange={(e) => setTxTo(e.target.value)}
              className="w-36"
              style={{ backgroundColor: "#fff" }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:ml-auto"
            onClick={() => downloadInventoryCSV(items, transactions)}
            data-ocid="inventory.download_button"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download Excel
          </Button>
        </div>
        {filteredTx.length === 0 ? (
          <div
            className="p-12 text-center text-muted-foreground"
            data-ocid="inventory.empty_state"
          >
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {[
                    "#",
                    "Date",
                    "Item Name",
                    "Type",
                    "Quantity",
                    "Notes",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTx.map((tx, i) => {
                  const item = itemMap.get(String(tx.itemId));
                  return (
                    <tr
                      key={String(tx.id)}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`inventory.row.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-xs">
                        {formatDate(tx.timestamp)}
                      </td>
                      <td className="px-3 py-2.5 font-medium">
                        {item?.name ?? "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            tx.txType === "IN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tx.txType === "IN" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {tx.txType}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-semibold">
                        {String(tx.quantity)}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground max-w-xs truncate">
                        {tx.notes || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTx(tx.id)}
                          data-ocid={`inventory.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent data-ocid="inventory.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Add Stock Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Item Name</Label>
              <Input
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Yonex BG65"
                style={{ backgroundColor: "#fff" }}
                data-ocid="inventory.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={itemForm.category}
                onValueChange={(v) =>
                  setItemForm((f) => ({ ...f, category: v }))
                }
              >
                <SelectTrigger
                  style={{ backgroundColor: "#fff" }}
                  data-ocid="inventory.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select
                value={itemForm.unit}
                onValueChange={(v) => setItemForm((f) => ({ ...f, unit: v }))}
              >
                <SelectTrigger
                  style={{ backgroundColor: "#fff" }}
                  data-ocid="inventory.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddItemOpen(false)}
              data-ocid="inventory.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={addItem.isPending || !itemForm.name.trim()}
              className="bg-primary text-primary-foreground"
              data-ocid="inventory.submit_button"
            >
              {addItem.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Transaction Dialog */}
      <Dialog
        open={addTxOpen}
        onOpenChange={(open) => {
          setAddTxOpen(open);
          if (!open)
            setTxForm({ itemId: "", txType: "IN", quantity: "1", notes: "" });
        }}
      >
        <DialogContent data-ocid="inventory.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Record Transaction
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Select Item</Label>
              <Select
                value={txForm.itemId}
                onValueChange={(v) => setTxForm((f) => ({ ...f, itemId: v }))}
              >
                <SelectTrigger
                  style={{ backgroundColor: "#fff" }}
                  data-ocid="inventory.select"
                >
                  <SelectValue placeholder="Choose item..." />
                </SelectTrigger>
                <SelectContent>
                  {items.map((it) => (
                    <SelectItem key={String(it.id)} value={String(it.id)}>
                      {it.name} ({it.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={txForm.txType === "IN" ? "default" : "outline"}
                  className={
                    txForm.txType === "IN"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }
                  onClick={() => setTxForm((f) => ({ ...f, txType: "IN" }))}
                  data-ocid="inventory.toggle"
                >
                  <TrendingUp className="w-4 h-4 mr-1" /> IN
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={txForm.txType === "OUT" ? "default" : "outline"}
                  className={
                    txForm.txType === "OUT"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : ""
                  }
                  onClick={() => setTxForm((f) => ({ ...f, txType: "OUT" }))}
                  data-ocid="inventory.toggle"
                >
                  <TrendingDown className="w-4 h-4 mr-1" /> OUT
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={txForm.quantity}
                onChange={(e) =>
                  setTxForm((f) => ({ ...f, quantity: e.target.value }))
                }
                style={{ backgroundColor: "#fff" }}
                data-ocid="inventory.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input
                value={txForm.notes}
                onChange={(e) =>
                  setTxForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="e.g. Received from supplier"
                style={{ backgroundColor: "#fff" }}
                data-ocid="inventory.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTxOpen(false)}
              data-ocid="inventory.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTx}
              disabled={addTx.isPending || !txForm.itemId}
              className="bg-primary text-primary-foreground"
              data-ocid="inventory.submit_button"
            >
              {addTx.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Confirm Dialog */}
      <Dialog
        open={deleteItemId !== null}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <DialogContent data-ocid="inventory.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Delete Stock Item
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure? This will also remove all transactions for this item.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteItemId(null)}
              data-ocid="inventory.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={deleteItem.isPending}
              data-ocid="inventory.confirm_button"
            >
              {deleteItem.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RepairRow({
  r,
  index,
  onStatusChange,
  onChargesBlur,
  onEdit,
  onDelete,
}: {
  r: RepairRequest;
  index: number;
  onStatusChange: (id: bigint, status: string) => void;
  onChargesBlur: (r: RepairRequest, charges: string) => void;
  onEdit: (r: RepairRequest) => void;
  onDelete: (id: bigint) => void;
}) {
  const [localCharges, setLocalCharges] = useState(r.charges);
  useEffect(() => {
    setLocalCharges(r.charges);
  }, [r.charges]);

  return (
    <tr
      className="hover:bg-muted/30 transition-colors"
      data-ocid={`requests.item.${index}`}
    >
      <td className="px-3 py-2.5 text-muted-foreground text-xs">{index}</td>
      <td className="px-3 py-2.5 whitespace-nowrap text-xs">
        {formatDate(r.submissionTimestamp)}
      </td>
      <td className="px-3 py-2.5 font-medium whitespace-nowrap">{r.name}</td>
      <td className="px-3 py-2.5 text-muted-foreground">{r.phone}</td>
      <td className="px-3 py-2.5">{r.racketBrand}</td>
      <td className="px-3 py-2.5">
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${serviceColor(r.serviceType)}`}
        >
          {r.serviceType}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-muted-foreground">
        {r.stringType || "—"}
      </td>
      <td className="px-3 py-2.5 text-center">{String(r.numberOfRackets)}</td>
      <td className="px-3 py-2.5">
        <Select value={r.status} onValueChange={(v) => onStatusChange(r.id, v)}>
          <SelectTrigger
            className="h-7 text-xs w-28"
            style={{ backgroundColor: "#fff" }}
            data-ocid={`requests.select.${index}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-3 py-2.5">
        <Input
          value={localCharges}
          onChange={(e) => setLocalCharges(e.target.value)}
          onBlur={() => onChargesBlur(r, localCharges)}
          placeholder="₹"
          className="h-7 w-20 text-xs"
          style={{ backgroundColor: "#fff" }}
          data-ocid={`requests.input.${index}`}
        />
      </td>
      <td className="px-3 py-2.5 text-xs">{r.paymentMode || "—"}</td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(r)}
            data-ocid={`requests.edit_button.${index}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(r.id)}
            data-ocid={`requests.delete_button.${index}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
