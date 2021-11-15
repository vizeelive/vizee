CREATE OR REPLACE VIEW transfers_totals AS
SELECT
	accounts.id As account_id,
	accounts.stripe_id,
	accounts.name,
	(sums.total /  100)::money As total
FROM (
	SELECT
		destination,
		SUM(amount) AS total
	FROM
		stripe.transfers
	GROUP BY
		destination) AS sums
	LEFT JOIN accounts ON accounts.stripe_id = sums.destination
	ORDER BY total DESC;
