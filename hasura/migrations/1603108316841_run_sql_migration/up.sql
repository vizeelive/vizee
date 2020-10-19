CREATE OR REPLACE VIEW transactions_report AS
 SELECT transactions.id,
    users.first_name,
    users.last_name,
    accounts.name AS account_name,
    events.name AS event_name,
    transactions.price,
    transactions.created
   FROM ((transactions
     LEFT JOIN users ON ((users.id = transactions.user_id)))
     LEFT JOIN events ON ((events.id = transactions.event_id))
     LEFT JOIN accounts ON ((accounts.id = events.account_id)));
