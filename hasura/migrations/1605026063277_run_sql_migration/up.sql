CREATE VIEW followers_report AS
 SELECT followers.account_id,
    count(*) AS followers
   FROM followers
  GROUP BY followers.account_id;
