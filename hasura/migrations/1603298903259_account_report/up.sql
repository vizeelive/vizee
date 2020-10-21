CREATE OR REPLACE VIEW account_report AS
SELECT
accounts.id,
name,
COALESCE(total, '$0') AS revenue,
COALESCE(count, 0) AS views,
COALESCE(subscriptions, 0) AS subscriptions,
COALESCE(favorites, 0) AS favorites,
COALESCE(events, 0) AS events
FROM accounts
LEFT JOIN account_revenue ON account_revenue.id = accounts.id
LEFT JOIN view_report ON view_report.account_id = accounts.id
LEFT JOIN subscriptions_report ON subscriptions_report.account_id = accounts.id
LEFT JOIN account_favorites ON account_favorites.account_id = accounts.id
LEFT JOIN (SELECT account_id, COUNT(*) AS events FROM events GROUP BY account_id) AS events_count ON events_count.account_id = accounts.id;
