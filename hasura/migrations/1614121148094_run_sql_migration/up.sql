CREATE OR REPLACE VIEW account_report AS
 SELECT accounts.id,
    accounts.username,
    accounts.name,
    COALESCE(account_revenue.total, '$0.00'::money) AS revenue,
    ( SELECT count(*) AS count
           FROM views
          WHERE views.account_id = accounts.id) AS viewcount,
    COALESCE(followers_report.followers, 0::bigint) AS followercount,
    COALESCE(account_favorites.favorites, 0::bigint) AS favoritecount,
    COALESCE(events_count.events, 0::bigint) AS eventcount,
    COALESCE(subscriptions_count.subscriptions, 0::bigint) AS subscriptionscount,
    COALESCE(tips_report.total, '$0.00'::money) AS tips
   FROM accounts
     LEFT JOIN account_revenue ON account_revenue.id = accounts.id
     LEFT JOIN followers_report ON followers_report.account_id = accounts.id
     LEFT JOIN account_favorites ON account_favorites.account_id = accounts.id
     LEFT JOIN ( SELECT subscriptions.account_id,
            count(*) AS subscriptions
           FROM subscriptions
          GROUP BY subscriptions.account_id) subscriptions_count ON subscriptions_count.account_id = accounts.id
     LEFT JOIN ( SELECT events.account_id,
            count(*) AS events
           FROM events
          GROUP BY events.account_id) events_count ON events_count.account_id = accounts.id
	 LEFT JOIN ( SELECT account_id, SUM(price) AS total FROM transactions WHERE is_tip=true GROUP BY account_id ) tips_report ON tips_report.account_id = accounts.id;
