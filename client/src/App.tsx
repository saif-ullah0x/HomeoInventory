import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Inventory from "@/pages/inventory";
import Analytics from "@/pages/analytics";
import Learning from "@/pages/learning";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inventory} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/learning" component={Learning} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Router />
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
