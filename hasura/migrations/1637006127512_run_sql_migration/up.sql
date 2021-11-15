CREATE OR REPLACE VIEW subscriptions AS
SELECT users.id AS user_id,
    products.id AS product_id,
    accounts.id AS account_id,
    current_period_start AS period_start,
    current_period_end AS period_end,
    (plan__amount / 100)::money AS amount,
    status,
    cancel_at_period_end AS cancelling,
    '{}'::jsonb AS data,
    plan__interval_count::integer As interval_count,
    (plan__amount / 100 * plan__interval_count / 30.416)::money AS monthly_amount
   FROM stripe.subscriptions
     LEFT JOIN users ON users.stripe_customer_id = stripe.subscriptions.customer
     LEFT JOIN products ON products.stripe_product_id = plan__product
     LEFT JOIN accounts ON accounts.stripe_id = stripe.subscriptions.transfer_data__destination;
