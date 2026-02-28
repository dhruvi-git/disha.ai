
-- Create activity log table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
CREATE POLICY "Users can view their own activity"
ON public.activity_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert their own activity"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Index for fast user queries
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs (user_id, created_at DESC);
CREATE INDEX idx_activity_logs_tool ON public.activity_logs (user_id, tool);
