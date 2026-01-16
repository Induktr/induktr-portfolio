import { useLocation } from "wouter";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/lib/queryClient";
import { ThemeProvider } from "./shared/lib/theme-provider";
import { PageTransition } from "@/shared/ui/PageTransition";
import { Header } from "@/widget/Header";
import { Toaster } from "@/shared/ui/toaster";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import { Projects } from "@/pages/Projects";
import Tools from "@/pages/Tools";
import { Marketplace } from "@/pages/Marketplace";
import FAQ from "@/pages/FAQ";
import { About } from "@/pages/About";
import NotFound from "@/pages/not-found";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import { Footer } from '@/widget/Footer';

function Router() {
  const [location] = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Switch key={location}>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/projects" component={Projects} />
          <Route path="/tools" component={Tools} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/faq" component={FAQ} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <PageTransition>
            <Router />
          </PageTransition>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;