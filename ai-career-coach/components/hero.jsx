import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react"; // Make sure to install lucide-react if you haven't

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      
      {/* The Purple Glow Effect Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/30 rounded-[100%] blur-[120px] -z-10" />
      
      <div className="container mx-auto px-6 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          New: AI Resume Analysis
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Your AI Career Coach <br />
          for <span className="text-purple-400">Professional Success</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Disha AI helps you craft the perfect resume, prepare for interviews, 
          and navigate your career path with personalized AI guidance.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold h-12 px-8">
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 h-12 px-8 text-white group">
            Watch Demo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;