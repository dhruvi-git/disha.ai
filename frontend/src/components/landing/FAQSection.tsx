import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does Disha AI create tailored content?",
    answer: "Disha AI uses advanced language models to analyze your profile, industry, and career goals, then generates personalized resumes, cover letters, interview questions, and career roadmaps specifically tailored to you.",
  },
  {
    question: "How accurate are the AI-generated interview questions?",
    answer: "Our AI is trained on thousands of real interview scenarios across 50+ industries. Questions are role-specific, difficulty-graded, and regularly updated to reflect current hiring trends.",
  },
  {
    question: "Is my data secure with Disha AI?",
    answer: "Absolutely. We use enterprise-grade encryption for all data. Your personal information and documents are never shared with third parties.",
  },
  {
    question: "How can I track my interview preparation progress?",
    answer: "Your dashboard shows detailed analytics including practice session history, performance scores, areas of improvement, and personalized recommendations.",
  },
  {
    question: "Can I edit the AI-generated content?",
    answer: "Yes! All AI-generated resumes, cover letters, and other documents are fully editable. The AI provides a strong foundation that you can customize to your preference.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`item-${i}`} className="border-border/50 px-4">
                <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
