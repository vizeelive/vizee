CREATE OR REPLACE VIEW subscriptions As
SELECT
	users.id AS user_id,
	products.id AS product_id,
	accounts.id As account_id,
	TO_TIMESTAMP(CAST(data ->> 'current_period_start' AS integer)) AS period_start,
	TO_TIMESTAMP(CAST(data ->> 'current_period_end' AS integer)) AS period_end,
	((data -> 'items' -> 'data' -> 0 -> 'plan' -> 'amount')::int / 100)::money AS amount,
	data ->> 'status' AS status
FROM
	stripe_subscriptions
	LEFT JOIN users ON users.stripe_customer_id = data ->> 'customer'
	LEFT JOIN products ON products.stripe_product_id = data -> 'items' -> 'data' -> 0 -> 'plan' ->> 'product'
	LEFT JOIN accounts ON accounts.stripe_id = data -> 'transfer_data' ->> 'destination';
