import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Loader2, Search, ExternalLink, MapPin, Building2 } from "lucide-react";

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url?: string;
}

const JobFinderPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const searchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-jobs", {
        body: { query, location, type },
      });
      if (error) throw error;
      setJobs(data.jobs || []);
      logActivity("jobs", "search");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Job Finder</h1>
      <p className="text-sm text-muted-foreground mb-6">Discover job opportunities matched to your skills.</p>

      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs">Role / Keywords</Label>
            <Input placeholder="e.g. React Developer" value={query} onChange={(e) => setQuery(e.target.value)} className="bg-input border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Location</Label>
            <Input placeholder="e.g. Bangalore, Remote" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-input border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={searchJobs} variant="glow" className="mt-4" disabled={loading || !query.trim()}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : <><Search className="mr-2 h-4 w-4" /> Find Jobs</>}
        </Button>
      </div>

      {jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="glass-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">{job.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{job.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && query && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Search for jobs to see AI-curated results</p>
        </div>
      )}
    </div>
  );
};

export default JobFinderPage;
