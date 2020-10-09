CREATE OR REPLACE VIEW events_report AS
 SELECT events.id,
    events.name,
    events.created_by,
    events.start,
    events."end",
    events.description,
    events.price,
    events.created,
    events.account_id,
    events.photo,
    events.preview,
    events.category_id,
    ( SELECT count(*) AS count
           FROM transactions
          WHERE (transactions.event_id = events.id)) AS transactions,
    ( SELECT count(*) AS count
           FROM favorites
          WHERE (favorites.event_id = events.id)) AS favorites,
    (SELECT COUNT(*) AS count FROM views WHERE event_id = events.id GROUP BY event_id) AS views,
    events.type
   FROM events;
