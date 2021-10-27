CREATE OR REPLACE VIEW subscriptions AS
SELECT users.id AS user_id,
    products.id AS product_id,
    accounts.id AS account_id,
    to_timestamp(((stripe_subscriptions.data ->> 'current_period_start'::text)::integer)::double precision) AS period_start,
    to_timestamp(((stripe_subscriptions.data ->> 'current_period_end'::text)::integer)::double precision) AS period_end,
    ((((((stripe_subscriptions.data -> 'items'::text) -> 'data'::text) -> 0) -> 'plan'::text) -> 'amount'::text)::integer / 100)::money AS amount,
    stripe_subscriptions.data ->> 'status'::text AS status,
    (stripe_subscriptions.data -> 'cancel_at_period_end')::boolean AS cancelling,
    data
   FROM stripe_subscriptions
     LEFT JOIN users ON users.stripe_customer_id = (stripe_subscriptions.data ->> 'customer'::text)
     LEFT JOIN products ON products.stripe_product_id = (((((stripe_subscriptions.data -> 'items'::text) -> 'data'::text) -> 0) -> 'plan'::text) ->> 'product'::text)
     LEFT JOIN accounts ON accounts.stripe_id = ((stripe_subscriptions.data -> 'transfer_data'::text) ->> 'destination'::text);
