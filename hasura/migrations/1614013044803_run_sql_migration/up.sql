CREATE OR REPLACE VIEW subscriptions AS
SELECT
	users_access.id,
	users_access.user_id,
	users.first_name,
	users.last_name,
	users.email,
	accounts.id AS account_id,
	accounts.name,
	products.price,
	users_access.event_id
FROM
	users_access
	LEFT JOIN products ON products.id = users_access.product_id
	LEFT JOIN accounts ON accounts.id = users_access.account_id
	LEFT JOIN users ON users.id = users_access.user_id
WHERE
	product_id IS NOT NULL
	AND products.recurring = TRUE
	AND users_access.expiry > now();
