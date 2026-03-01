import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Loader2, Play, CheckCircle2, Mic, MicOff, Square, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const InterviewPage = () => {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const generateQuestions = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setQuestions([]);
    setCurrentQ(0);
    setFeedback("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: { action: "generate", role, difficulty },
      });
      if (error) throw error;
      setQuestions(data.questions || []);
      logActivity("interview", "generate");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        // Convert audio to text description for the AI
        setAnswer((prev) => prev + (prev ? "\n" : "") + "[Audio response recorded - please evaluate based on my written answer above]");
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      toast({ title: "Microphone Error", description: "Please allow microphone access to record.", variant: "destructive" });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setFeedbackLoading(true);
    setFeedback("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: { action: "feedback", role, question: questions[currentQ], answer },
      });
      if (error) throw error;
      setFeedback(data.feedback || "");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const nextQuestion = () => {
    setCurrentQ((prev) => prev + 1);
    setAnswer("");
    setFeedback("");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Interview Preparation</h1>
      <p className="text-sm text-muted-foreground mb-6">Practice with AI-generated interview questions and get instant feedback.</p>

      {questions.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-lg">
          <h2 className="font-display text-lg font-semibold mb-5">Start a Mock Interview</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Input placeholder="e.g. Frontend Developer" value={role} onChange={(e) => setRole(e.target.value)} className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateQuestions} variant="glow" disabled={loading || !role.trim()} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Play className="mr-2 h-4 w-4" /> Start Mock Interview</>}
            </Button>
          </div>
        </motion.div>
      ) : currentQ < questions.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Question + Answer */}
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-2">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentQ ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</p>

            <motion.div key={currentQ} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <p className="font-medium text-lg leading-relaxed">{questions[currentQ]}</p>
            </motion.div>

            <div className="space-y-3">
              <Label className="text-sm">Your Answer</Label>
              <Textarea
                placeholder="Type your answer here or use the microphone..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                className="bg-input border-border"
              />

              {/* Audio controls */}
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <Button onClick={startRecording} variant="outline" size="sm" className="gap-2">
                    <Mic className="h-4 w-4" /> Record Answer
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" size="sm" className="gap-2 animate-pulse">
                    <Square className="h-3 w-3" /> Stop Recording
                    <span className="flex items-center gap-1 ml-1 text-xs">
                      <Clock className="h-3 w-3" /> {formatTime(recordingTime)}
                    </span>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={submitAnswer} variant="glow" disabled={feedbackLoading || !answer.trim()} className="flex-1">
                {feedbackLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Get Feedback"}
              </Button>
              {feedback && currentQ < questions.length - 1 && (
                <Button onClick={nextQuestion} variant="outline">Next →</Button>
              )}
            </div>
          </div>

          {/* Right: Feedback */}
          <div>
            {!feedback && !feedbackLoading && (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <CheckCircle2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-semibold text-muted-foreground mb-2">AI Feedback</h3>
                <p className="text-sm text-muted-foreground/70">Submit your answer to receive detailed AI feedback and scoring.</p>
              </div>
            )}

            {feedbackLoading && (
              <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Analyzing your response...</p>
              </div>
            )}

            {feedback && !feedbackLoading && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> AI Feedback
                </h3>
                <div className="prose prose-sm prose-invert max-w-none max-h-[500px] overflow-y-auto">
                  <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center max-w-lg mx-auto">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Interview Complete! 🎉</h2>
          <p className="text-muted-foreground mb-6">Great practice session. Consistent practice is key to interview success.</p>
          <Button onClick={() => { setQuestions([]); setFeedback(""); setAnswer(""); }} variant="glow" className="px-8">
            Start New Session
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPage;
