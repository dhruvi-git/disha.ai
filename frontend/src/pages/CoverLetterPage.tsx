import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Loader2, FileEdit, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CoverLetterPage = () => {
  const [formData, setFormData] = useState({
    name: "", role: "", company: "", experience: "", jobDescription: "",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const update = (key: string, value: string) => setFormData((p) => ({ ...p, [key]: value }));

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-cover-letter", {
        body: formData,
      });
      if (error) throw error;
      setCoverLetter(data.coverLetter || "");
      logActivity("cover-letter", "generate");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Cover Letter Generator</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate personalized cover letters tailored to each job.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Form */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" /> Details
          </h2>
          {[
            { key: "name", label: "Your Name", placeholder: "John Doe" },
            { key: "role", label: "Target Role", placeholder: "Product Manager" },
            { key: "company", label: "Company Name", placeholder: "Google" },
          ].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs">{f.label}</Label>
              <Input placeholder={f.placeholder} value={(formData as any)[f.key]} onChange={(e) => update(f.key, e.target.value)} className="bg-input border-border text-sm" />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">Your Experience</Label>
            <Textarea placeholder="Brief summary of relevant experience..." value={formData.experience} onChange={(e) => update("experience", e.target.value)} rows={3} className="bg-input border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Job Description (optional)</Label>
            <Textarea placeholder="Paste the job description..." value={formData.jobDescription} onChange={(e) => update("jobDescription", e.target.value)} rows={4} className="bg-input border-border text-sm" />
          </div>
          <Button onClick={generate} variant="glow" disabled={loading || !formData.name || !formData.role || !formData.company} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Cover Letter"}
          </Button>
        </div>

        {/* Right: Output */}
        <div>
          {!coverLetter && !loading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <FileEdit className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-lg font-semibold text-muted-foreground mb-2">Your Cover Letter</h3>
              <p className="text-sm text-muted-foreground/70">Fill in your details and click Generate to see your tailored cover letter here.</p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Writing your cover letter...</p>
            </div>
          )}

          {coverLetter && !loading && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold">Your Cover Letter</h2>
                <Button onClick={copyLetter} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none bg-secondary/30 rounded-lg p-5 max-h-[600px] overflow-y-auto">
                <ReactMarkdown>{coverLetter}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
