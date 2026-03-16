-- Enable Supabase Realtime for ClawDash tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

ALTER PUBLICATION supabase_realtime ADD TABLE tasks, agent_chat, chatlog, docs;
