CREATE VIEW view_report AS
SELECT event_id, city, region, country, COUNT(*) FROM views GROUP BY city, region, country, event_id;
