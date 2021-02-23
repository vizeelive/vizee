UPDATE
	transactions
SET
	account_id = events.account_id
FROM
	events
WHERE
	events.id = transactions.event_id
	AND transactions.event_id IS NOT NULL;
