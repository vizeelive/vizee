CREATE OR REPLACE VIEW presence AS
SELECT event_id, user_id, MAX(created) AS last_seen FROM views WHERE created > created - INTERVAL '5 minutes' GROUP BY user_id, event_id;
