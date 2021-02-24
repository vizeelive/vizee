CREATE OR REPLACE VIEW supporters_report AS
SELECT
transactions.account_id,
users.id AS user_id,
users.first_name,
users.last_name,
SUM(price) AS total
FROM
transactions
LEFT JOIN users ON (users.id = transactions.user_id)
GROUP BY transactions.account_id, users.id, users.first_name, users.last_name;
