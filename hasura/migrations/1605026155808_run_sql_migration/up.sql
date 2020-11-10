CREATE VIEW account_report AS
   SELECT accounts.id,
    accounts.username,
    accounts.name,
    COALESCE(account_revenue.total, '$0.00'::money) AS revenue,
    COALESCE(view_report.count, 0::bigint) AS views,
    COALESCE(followers_report.followers, 0::bigint) AS followers,
    COALESCE(account_favorites.favorites, 0::bigint) AS favorites,
    COALESCE(events_count.events, 0::bigint) AS events
   FROM accounts
     LEFT JOIN account_revenue ON account_revenue.id = accounts.id
     LEFT JOIN view_report ON view_report.account_id = accounts.id
     LEFT JOIN followers_report ON followers_report.account_id = accounts.id
     LEFT JOIN account_favorites ON account_favorites.account_id = accounts.id
     LEFT JOIN ( SELECT events.account_id,
            count(*) AS events
           FROM events
          GROUP BY events.account_id) events_count ON events_count.account_id = accounts.id;
