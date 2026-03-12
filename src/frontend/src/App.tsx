import { AdminPage } from "@/components/AdminPage";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { RepairForm } from "@/components/RepairForm";
import { Services } from "@/components/Services";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MainSite() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Services />
      <HowItWorks />
      <RepairForm />
      <ContactUs />
      <Footer />
    </div>
  );
}

function Router() {
  const path = window.location.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) {
    return <AdminPage />;
  }
  return <MainSite />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
