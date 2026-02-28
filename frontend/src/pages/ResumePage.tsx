import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Loader2, FileText, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ResumePage = () => {
  const [formData, setFormData] = useState({
    name: "", role: "", experience: "", skills: "", education: "", summary: "",
  });
  const [resume, setResume] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const update = (key: string, value: string) => setFormData((p) => ({ ...p, [key]: value }));

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-resume", {
        body: { action: "generate", ...formData },
      });
      if (error) throw error;
      setResume(data.resume || "");
      setFeedback("");
      logActivity("resume", "generate");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const analyze = async () => {
    if (!resume) return;
    setFeedbackLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-resume", {
        body: { action: "analyze", resume },
      });
      if (error) throw error;
      setFeedback(data.feedback || "");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const copyResume = () => {
    navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "John Doe" },
    { key: "role", label: "Target Role", placeholder: "Software Engineer" },
    { key: "experience", label: "Experience", placeholder: "3 years at Google as SWE...", textarea: true },
    { key: "skills", label: "Skills", placeholder: "React, TypeScript, Node.js..." },
    { key: "education", label: "Education", placeholder: "B.Tech in CS from IIT Delhi" },
    { key: "summary", label: "Summary (optional)", placeholder: "Brief professional summary...", textarea: true },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Resume Builder</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate an ATS-optimized resume and get AI feedback.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Form */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Your Details
          </h2>
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label className="text-xs">{field.label}</Label>
              {field.textarea ? (
                <Textarea placeholder={field.placeholder} value={(formData as any)[field.key]} onChange={(e) => update(field.key, e.target.value)} rows={3} className="bg-input border-border text-sm" />
              ) : (
                <Input placeholder={field.placeholder} value={(formData as any)[field.key]} onChange={(e) => update(field.key, e.target.value)} className="bg-input border-border text-sm" />
              )}
            </div>
          ))}
          <Button onClick={generate} variant="glow" disabled={loading || !formData.name || !formData.role} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Resume"}
          </Button>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          {!resume && !loading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-lg font-semibold text-muted-foreground mb-2">Your Resume Preview</h3>
              <p className="text-sm text-muted-foreground/70">Fill in your details and click Generate to see your AI-crafted resume here.</p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Crafting your professional resume...</p>
            </div>
          )}

          {resume && !loading && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold">Generated Resume</h2>
                <div className="flex gap-2">
                  <Button onClick={copyResume} variant="outline" size="sm">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button onClick={analyze} variant="outline" size="sm" disabled={feedbackLoading}>
                    {feedbackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                  </Button>
                </div>
              </div>
              <div className="prose prose-sm prose-invert max-w-none bg-secondary/30 rounded-lg p-5 max-h-[600px] overflow-y-auto">
                <ReactMarkdown>{resume}</ReactMarkdown>
              </div>
            </div>
          )}

          {feedback && (
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold mb-3">AI Feedback</h2>
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
