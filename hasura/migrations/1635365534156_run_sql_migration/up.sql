CREATE OR REPLACE VIEW payouts_totals AS
SELECT
	accounts.id As account_id,
	accounts.name as account_name,
	amount
FROM (
	SELECT
		account_id,
		SUM((data -> 'amount')::int / 100)::money AS amount
	FROM
		stripe_payouts
	GROUP BY
		account_id) AS payouts
	LEFT JOIN accounts ON accounts.id = payouts.account_id;
