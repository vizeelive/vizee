CREATE OR REPLACE VIEW presence AS
 SELECT views.event_id,
    views.user_id,
    max(views.created) AS last_seen
   FROM views
  WHERE "created" >= NOW() - INTERVAL '5 minutes'
  GROUP BY views.user_id, views.event_id;
