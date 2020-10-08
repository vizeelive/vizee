CREATE VIEW members AS
SELECT accounts_users.id, accounts.id AS account_id, users.id AS user_id, accounts.name AS account_name, accounts.username, users.first_name, users.last_name, accounts_users.created, accounts_users.created_by FROM accounts_users 
LEFT JOIN users ON users.id = accounts_users.user_id
LEFT JOIN  accounts ON accounts.id = accounts_users.account_id
ORDER BY account_name;
