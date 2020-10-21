CREATE OR REPLACE VIEW account_favorites AS
SELECT account_id, COUNT(*) AS favorites FROM favorites GROUP BY account_id;
