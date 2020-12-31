CREATE OR REPLACE VIEW affiliate_report AS
SELECT 
affiliate_id,
accounts.name AS account_name,
events.name AS event_name,
events.price,
transactions.created
FROM transactions
LEFT JOIN events ON events.id = transactions.event_id
LEFT JOIN accounts ON accounts.id = events.account_id;
