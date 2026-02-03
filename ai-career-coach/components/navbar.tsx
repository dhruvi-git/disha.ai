import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">
                D
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Disha AI
            </span>
        </div>

        {/* Navigation Links - Hidden on mobile for simplicity */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                Get Started
            </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;