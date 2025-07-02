
-- Create table for completed missions
CREATE TABLE public.missions_completed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT NOT NULL,
  mission_name TEXT NOT NULL,
  mission_type TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  period TEXT,
  school TEXT
);

-- Enable Row Level Security
ALTER TABLE public.missions_completed ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT - users can only see their own completed missions
CREATE POLICY "Users can view their own completed missions"
ON public.missions_completed
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for INSERT - users can only insert their own completed missions
CREATE POLICY "Users can insert their own completed missions"
ON public.missions_completed
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE - users can only update their own completed missions
CREATE POLICY "Users can update their own completed missions"
ON public.missions_completed
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for DELETE - users can only delete their own completed missions
CREATE POLICY "Users can delete their own completed missions"
ON public.missions_completed
FOR DELETE
USING (auth.uid() = user_id);
