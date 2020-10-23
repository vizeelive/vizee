CREATE OR REPLACE VIEW presence_events AS
SELECT event_id, COUNT(*) FROM presence GROUP BY event_id;
