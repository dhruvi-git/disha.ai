import { Bot, BriefcaseBusiness, FileText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Career Guidance",
    description: "Get personalized career advice and insights powered by advanced AI technology.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Interview Preparation",
    description: "Practice with role-specific questions and get instant feedback to improve your performance.",
  },
  {
    icon: TrendingUp,
    title: "Career Roadmap",
    description: "Get a clear path forward with AI-generated career roadmaps tailored to your goals.",
  },
  {
    icon: FileText,
    title: "Smart Resume Builder",
    description: "Generate ATS-optimized resumes with AI assistance and get detailed feedback.",
  },
];

const stats = [
  { value: "50+", label: "Industries Covered" },
  { value: "1000+", label: "Interview Questions" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "AI Support" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Powerful Features for Your <span className="text-gradient-purple">Career Growth</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
