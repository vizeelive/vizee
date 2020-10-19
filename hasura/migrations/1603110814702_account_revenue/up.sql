CREATE OR REPLACE VIEW account_revenue AS
SELECT accounts.id, accounts.name AS account_name, total
FROM
(SELECT SUM(transactions.price) AS total, account_id FROM transactions 
LEFT JOIN events ON events.id = transactions.event_id
LEFT JOIN accounts ON accounts.id = events.account_id
GROUP BY account_id) AS account_totals
LEFT JOIN accounts ON accounts.id = account_totals.account_id;
