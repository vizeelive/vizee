CREATE OR REPLACE VIEW subscriptions AS
 SELECT users.id AS user_id,
    products.id AS product_id,
    accounts.id AS account_id,
    subscriptions.current_period_start AS period_start,
    subscriptions.current_period_end AS period_end,
    (subscriptions.plan__amount / 100)::money AS amount,
    subscriptions.status,
    subscriptions.cancel_at_period_end AS cancelling,
    '{}'::jsonb AS data,
    subscriptions.plan__interval_count::integer AS interval_count,
    ((subscriptions.plan__amount / 100 * subscriptions.plan__interval_count)::numeric / 30.416)::money AS monthly_amount,
    customers.email,
    subscriptions.created
   FROM stripe.subscriptions
     LEFT JOIN users ON users.stripe_customer_id = subscriptions.customer
     LEFT JOIN products ON products.stripe_product_id = subscriptions.plan__product
     LEFT JOIN accounts ON accounts.stripe_id = subscriptions.transfer_data__destination
     LEFT JOIN stripe.customers ON customers.id = subscriptions.customer;
