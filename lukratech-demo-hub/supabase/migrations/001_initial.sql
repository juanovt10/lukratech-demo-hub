CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  ran_at TIMESTAMPTZ DEFAULT now(),
  items_reviewed INT,
  actions_taken INT,
  reasoning_summary TEXT,
  raw_claude_output JSONB
);

CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_id TEXT,
  message_sent TEXT,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;

-- Public read for demo dashboard
CREATE POLICY "Public read agent_runs" 
  ON agent_runs FOR SELECT USING (true);
CREATE POLICY "Public read agent_actions" 
  ON agent_actions FOR SELECT USING (true);
