import { Link, useLocation } from "wouter";

export default function Tabs() {
  const [location] = useLocation();
  
  return (
    <div className="border-b border-border mb-6">
      <nav className="-mb-px flex space-x-8">
        <Link 
          href="/"
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            location === "/" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Inventory
        </Link>
        <Link 
          href="/analytics"
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            location === "/analytics" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Analytics
        </Link>
      </nav>
    </div>
  );
}
