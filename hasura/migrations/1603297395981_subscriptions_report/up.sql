CREATE OR REPLACE VIEW subscriptions_report AS
SELECT account_id, COUNT(*) AS subscriptions FROM subscriptions GROUP BY account_id;
