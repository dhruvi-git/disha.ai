import { useEffect, useState } from "react";
import {
  MessageSquare, FileText, BriefcaseBusiness, Map, Search, FileEdit,
  ArrowRight, Sparkles, TrendingUp, Target, Clock, BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TOOL_META: Record<string, { label: string; icon: any; to: string; color: string; chartColor: string }> = {
  chat: { label: "AI Coach", icon: MessageSquare, to: "/dashboard/chat", color: "from-primary/20 to-accent/10", chartColor: "hsl(265 70% 60%)" },
  interview: { label: "Interview Prep", icon: BriefcaseBusiness, to: "/dashboard/interview", color: "from-emerald-500/20 to-teal-500/10", chartColor: "hsl(160 60% 45%)" },
  resume: { label: "Resume Builder", icon: FileText, to: "/dashboard/resume", color: "from-blue-500/20 to-cyan-500/10", chartColor: "hsl(210 70% 55%)" },
  "cover-letter": { label: "Cover Letter", icon: FileEdit, to: "/dashboard/cover-letter", color: "from-amber-500/20 to-orange-500/10", chartColor: "hsl(35 80% 55%)" },
  roadmap: { label: "Career Roadmap", icon: Map, to: "/dashboard/roadmap", color: "from-rose-500/20 to-pink-500/10", chartColor: "hsl(350 70% 55%)" },
  jobs: { label: "Job Finder", icon: Search, to: "/dashboard/jobs", color: "from-violet-500/20 to-purple-500/10", chartColor: "hsl(280 60% 55%)" },
};

const tools = [
  { key: "chat", desc: "Get personalized career advice and guidance from your AI mentor" },
  { key: "interview", desc: "Practice with AI-generated questions and get real-time feedback" },
  { key: "resume", desc: "Build ATS-optimized resumes with AI analysis and scoring" },
  { key: "cover-letter", desc: "Generate compelling cover letters tailored to each application" },
  { key: "roadmap", desc: "Get a step-by-step plan to reach your dream role" },
  { key: "jobs", desc: "Discover curated job opportunities matching your profile" },
];

interface ActivityLog {
  id: string;
  tool: string;
  action: string;
  created_at: string;
}

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const DashboardHome = () => {
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [toolCounts, setToolCounts] = useState<Record<string, number>>({});
  const [totalUses, setTotalUses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [recentRes, allRes] = await Promise.all([
        supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("activity_logs")
          .select("tool")
          .eq("user_id", user.id),
      ]);

      setRecentActivity(recentRes.data || []);
      const counts: Record<string, number> = {};
      (allRes.data || []).forEach((r) => {
        counts[r.tool] = (counts[r.tool] || 0) + 1;
      });
      setToolCounts(counts);
      setTotalUses((allRes.data || []).length);
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = Object.keys(TOOL_META).map((key) => ({
    name: TOOL_META[key].label,
    uses: toolCounts[key] || 0,
    fill: TOOL_META[key].chartColor,
  }));

  const mostUsedTool = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-3">
          Welcome to <span className="text-gradient-purple">Disha AI</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Your all-in-one AI career platform. Here's your usage overview.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Target, label: "Total Uses", value: loading ? "—" : String(totalUses), sub: "across all tools" },
          { icon: TrendingUp, label: "Most Used", value: loading ? "—" : (mostUsedTool ? TOOL_META[mostUsedTool[0]]?.label || mostUsedTool[0] : "None yet"), sub: mostUsedTool ? `${mostUsedTool[1]} uses` : "start exploring" },
          { icon: Sparkles, label: "Tools Available", value: "6", sub: "AI-powered" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Usage chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Usage by Tool</h2>
          </div>
          {totalUses === 0 && !loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No usage data yet. Try a tool to see your stats!</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "hsl(240 8% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240 8% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 15% 10%)", border: "1px solid hsl(265 30% 20%)", borderRadius: 8, fontSize: 13 }}
                  cursor={{ fill: "hsl(265 20% 15% / 0.3)" }}
                />
                <Bar dataKey="uses" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No activity yet. Start using the tools!</p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {recentActivity.map((log) => {
                const meta = TOOL_META[log.tool];
                const Icon = meta?.icon || Sparkles;
                return (
                  <Link
                    key={log.id}
                    to={meta?.to || "/dashboard"}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/60 transition-colors group"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${meta?.color || "from-primary/20 to-accent/10"} text-primary shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meta?.label || log.tool}</p>
                      <p className="text-xs text-muted-foreground capitalize">{log.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(log.created_at)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Tools grid */}
      <h2 className="font-display text-lg font-semibold mb-4">Your Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, i) => {
          const meta = TOOL_META[tool.key];
          const Icon = meta.icon;
          const count = toolCounts[tool.key] || 0;
          return (
            <motion.div key={tool.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}>
              <Link
                to={meta.to}
                className="glass-card p-6 flex flex-col gap-4 hover:border-primary/40 hover:glow-purple transition-all duration-300 group block h-full"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-primary group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  {count > 0 && (
                    <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-2 py-1 rounded-full">
                      {count} use{count !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold mb-1.5">{meta.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                </div>
                <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border/50">
                  Get Started <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;
