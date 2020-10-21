CREATE OR REPLACE VIEW view_report AS
 SELECT
 views.event_id,
    views.city,
    views.region,
    views.country,
    count(*) AS count,
     views.account_id
   FROM views
  GROUP BY views.city, views.region, views.country, views.event_id, views.account_id;
