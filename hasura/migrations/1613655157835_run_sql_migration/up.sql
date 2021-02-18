CREATE OR REPLACE VIEW account_revenue AS
 SELECT accounts.id,
    accounts.name AS account_name,
    account_totals.total
   FROM ( SELECT sum(transactions.price) AS total,
            accounts_1.id AS account_id
           FROM transactions
             LEFT JOIN accounts accounts_1 ON accounts_1.id = transactions.account_id
          GROUP BY accounts_1.id) account_totals
     LEFT JOIN accounts ON accounts.id = account_totals.account_id;
