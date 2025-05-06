import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { checkRedirectResult } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Inventory from "@/pages/inventory";
import Analytics from "@/pages/analytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inventory} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthRedirectHandler() {
  const { toast } = useToast();
  
  // Check for authentication redirect result when app loads
  useEffect(() => {
    async function handleAuthRedirect() {
      try {
        const user = await checkRedirectResult();
        if (user) {
          // Successfully logged in after redirect
          toast({
            title: "Successfully logged in",
            description: "Your account has been connected successfully.",
          });
        }
      } catch (error) {
        console.error("Auth redirect error:", error);
        toast({
          title: "Login failed",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    handleAuthRedirect();
  }, [toast]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Router />
        <Footer />
        <AuthRedirectHandler />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
