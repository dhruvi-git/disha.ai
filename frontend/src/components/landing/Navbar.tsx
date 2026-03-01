import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Disha <span className="text-gradient-purple">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link to="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="glow" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
