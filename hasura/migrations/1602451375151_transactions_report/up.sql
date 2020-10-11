CREATE VIEW transactions_report AS
SELECT transactions.id, users.first_name, users.last_name, events.name, transactions.price, transactions.created FROM transactions
LEFT JOIN users ON users.id = transactions.user_id
LEFT JOIN events ON events.id = transactions.event_id;
