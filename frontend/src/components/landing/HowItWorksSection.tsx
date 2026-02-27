import { UserPlus, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
  },
  {
    icon: FileText,
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
  },
  {
    icon: MessageSquare,
    title: "Prepare for Interviews",
    description: "Practice with AI-powered mock interviews tailored to your role",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Four simple steps to accelerate your career growth</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
