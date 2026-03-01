import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Loader2, Map } from "lucide-react";
import ReactMarkdown from "react-markdown";

const RoadmapPage = () => {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("0-2");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-roadmap", {
        body: { currentRole, targetRole, experience },
      });
      if (error) throw error;
      setRoadmap(data.roadmap || "");
      logActivity("roadmap", "generate");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Career Roadmap</h1>
      <p className="text-sm text-muted-foreground mb-6">Get a personalized roadmap to reach your career goals.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2"><Map className="h-5 w-5 text-primary" /> Your Path</h2>
          <div className="space-y-1.5">
            <Label className="text-xs">Current Role / Status</Label>
            <Input placeholder="e.g. Junior Developer, Student" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} className="bg-input border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target Role</Label>
            <Input placeholder="e.g. Senior Software Engineer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="bg-input border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Years of Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} variant="glow" disabled={loading || !currentRole || !targetRole}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Roadmap"}
          </Button>
        </div>

        {roadmap && (
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold mb-4">Your Career Roadmap</h2>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
