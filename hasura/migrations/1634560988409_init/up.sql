CREATE FUNCTION public.account_default_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
		 INSERT INTO accounts_users(account_id,user_id)
		 VALUES(NEW.id, NEW.created_by);
	RETURN NEW;
END;
$$;
CREATE FUNCTION public.random_string(length integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
begin
  if length < 0 then
    raise exception 'Given length cannot be less than 0';
  end if;
  for i in 1..length loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$;
CREATE TABLE public.access_codes (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid,
    user_id uuid,
    created timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    transaction_id uuid,
    price money NOT NULL,
    account_id uuid,
    claimed timestamp with time zone
);
CREATE TABLE public.favorites (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    account_id uuid,
    created timestamp with time zone DEFAULT now(),
    created_by uuid
);
CREATE VIEW public.account_favorites AS
 SELECT favorites.account_id,
    count(*) AS favorites
   FROM public.favorites
  GROUP BY favorites.account_id;
CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    photo text,
    created_by text,
    created timestamp with time zone DEFAULT now(),
    username text,
    description text,
    instagram text,
    twitter text,
    facebook text,
    stripe_data jsonb,
    stripe_id text,
    subscription_rate integer DEFAULT 0 NOT NULL,
    fee_percent integer DEFAULT 20 NOT NULL,
    umami_id integer,
    umami_website uuid,
    tpl_color text,
    tpl_backgroundcolor text,
    tpl_primarycolor text,
    umami_username text,
    domain text,
    logo text,
    whitelabel boolean DEFAULT false NOT NULL,
    shopify_domain text,
    shopify_storefront_token text,
    shopify_token text,
    mattermost_channel_id text,
    preview text
);
CREATE TABLE public.transactions (
    user_id uuid,
    event_id uuid,
    created timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    price money NOT NULL,
    ref text,
    email text,
    affiliate_id uuid,
    account_id uuid,
    is_tip boolean DEFAULT false
);
CREATE VIEW public.account_revenue AS
 SELECT accounts.id,
    accounts.name AS account_name,
    account_totals.total
   FROM (( SELECT sum(transactions.price) AS total,
            accounts_1.id AS account_id
           FROM (public.transactions
             LEFT JOIN public.accounts accounts_1 ON ((accounts_1.id = transactions.account_id)))
          GROUP BY accounts_1.id) account_totals
     LEFT JOIN public.accounts ON ((accounts.id = account_totals.account_id)));
CREATE TABLE public.events (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_by uuid,
    start timestamp with time zone,
    "end" timestamp with time zone,
    description text,
    price money,
    created timestamp with time zone DEFAULT now(),
    account_id uuid,
    photo text,
    preview text,
    category_id uuid,
    type text,
    video text,
    location text,
    mux_livestream jsonb,
    mux_id text,
    status text DEFAULT 'idle'::text,
    location_pos point,
    published boolean DEFAULT true NOT NULL,
    thumb text,
    mux_asset_id text,
    account_only boolean DEFAULT false NOT NULL,
    on_network boolean DEFAULT true NOT NULL,
    stream_type text DEFAULT 'mux'::text,
    ivs_channel_arn text,
    tags_old jsonb DEFAULT jsonb_build_array()
);
CREATE TABLE public.followers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);
CREATE VIEW public.followers_report AS
 SELECT followers.account_id,
    count(*) AS followers
   FROM public.followers
  GROUP BY followers.account_id;
CREATE TABLE public.products (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price money NOT NULL,
    flexible_price boolean DEFAULT false NOT NULL,
    account_access boolean DEFAULT false NOT NULL,
    recurring boolean DEFAULT false NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    account_id uuid NOT NULL,
    access_length integer,
    stripe_product_id text,
    download_access boolean DEFAULT false NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text,
    last_name text,
    created timestamp with time zone DEFAULT now(),
    name text,
    city text,
    state text,
    country text,
    sub text,
    email text,
    affiliate_account_id uuid,
    affiliate_user_id uuid,
    stripe_customer_id text,
    code text NOT NULL
);
CREATE TABLE public.users_access (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    event_id uuid,
    account_id uuid,
    expiry timestamp with time zone NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    updated timestamp with time zone NOT NULL,
    email text,
    subscription boolean,
    stripe_customer_id text,
    stripe_subscription_id text,
    product_id uuid
);
CREATE VIEW public.subscriptions AS
 SELECT users_access.id,
    users_access.user_id,
    users.first_name,
    users.last_name,
    users.email,
    accounts.id AS account_id,
    accounts.name,
    products.price,
    users_access.event_id
   FROM (((public.users_access
     LEFT JOIN public.products ON ((products.id = users_access.product_id)))
     LEFT JOIN public.accounts ON ((accounts.id = users_access.account_id)))
     LEFT JOIN public.users ON ((users.id = users_access.user_id)))
  WHERE ((users_access.product_id IS NOT NULL) AND (products.recurring = true) AND (users_access.expiry > now()));
CREATE TABLE public.views (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now(),
    created_by uuid,
    city text,
    region text,
    country text,
    timezone text,
    loc point,
    ip text,
    postal text,
    account_id uuid,
    user_id uuid
);
CREATE VIEW public.account_report AS
 SELECT accounts.id,
    accounts.username,
    accounts.name,
    COALESCE(account_revenue.total, '$0.00'::money) AS revenue,
    ( SELECT count(*) AS count
           FROM public.views
          WHERE (views.account_id = accounts.id)) AS viewcount,
    COALESCE(followers_report.followers, (0)::bigint) AS followercount,
    COALESCE(account_favorites.favorites, (0)::bigint) AS favoritecount,
    COALESCE(events_count.events, (0)::bigint) AS eventcount,
    COALESCE(subscriptions_count.subscriptions, (0)::bigint) AS subscriptionscount,
    COALESCE(tips_report.total, '$0.00'::money) AS tips
   FROM ((((((public.accounts
     LEFT JOIN public.account_revenue ON ((account_revenue.id = accounts.id)))
     LEFT JOIN public.followers_report ON ((followers_report.account_id = accounts.id)))
     LEFT JOIN public.account_favorites ON ((account_favorites.account_id = accounts.id)))
     LEFT JOIN ( SELECT subscriptions.account_id,
            count(*) AS subscriptions
           FROM public.subscriptions
          GROUP BY subscriptions.account_id) subscriptions_count ON ((subscriptions_count.account_id = accounts.id)))
     LEFT JOIN ( SELECT events.account_id,
            count(*) AS events
           FROM public.events
          GROUP BY events.account_id) events_count ON ((events_count.account_id = accounts.id)))
     LEFT JOIN ( SELECT transactions.account_id,
            sum(transactions.price) AS total
           FROM public.transactions
          WHERE (transactions.is_tip = true)
          GROUP BY transactions.account_id) tips_report ON ((tips_report.account_id = accounts.id)));
CREATE TABLE public.accounts_users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    user_id uuid,
    created_by uuid,
    created timestamp with time zone DEFAULT now(),
    email text
);
CREATE VIEW public.affiliate_report AS
 SELECT transactions.affiliate_id,
    accounts.name AS account_name,
    events.name AS event_name,
    events.price,
    transactions.created
   FROM ((public.transactions
     LEFT JOIN public.events ON ((events.id = transactions.event_id)))
     LEFT JOIN public.accounts ON ((accounts.id = events.account_id)));
CREATE TABLE public.categories (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);
CREATE VIEW public.category_counts AS
 SELECT categories.id,
    categories.name,
    counts.count
   FROM (( SELECT events.category_id,
            count(*) AS count
           FROM public.events
          GROUP BY events.category_id) counts
     LEFT JOIN public.categories ON ((categories.id = counts.category_id)));
CREATE TABLE public.comments (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    body text NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL
);
CREATE TABLE public.events_playlists (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    playlist_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now(),
    created_by uuid NOT NULL
);
CREATE TABLE public.events_products (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL
);
CREATE VIEW public.events_report AS
 SELECT events.id,
    events.name,
    events.created_by,
    events.start,
    events."end",
    events.description,
    events.price,
    events.created,
    events.account_id,
    events.photo,
    events.preview,
    events.category_id,
    ( SELECT count(*) AS count
           FROM public.transactions
          WHERE (transactions.event_id = events.id)) AS transactions,
    ( SELECT count(*) AS count
           FROM public.favorites
          WHERE (favorites.event_id = events.id)) AS favorites,
    ( SELECT count(*) AS count
           FROM public.views
          WHERE (views.event_id = events.id)
          GROUP BY views.event_id) AS views,
    events.type,
    events.location,
    ( SELECT sum(transactions.price) AS total
           FROM public.transactions
          WHERE (transactions.event_id = events.id)) AS revenue,
    events.mux_livestream,
    events.mux_id,
    events.status,
    events.account_only,
    events.stream_type,
    events.ivs_channel_arn,
    events.tags_old AS tags
   FROM public.events;
CREATE TABLE public.events_tags (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);
CREATE VIEW public.favorite_events AS
 SELECT events.id,
    events.name,
    events.created_by,
    events.start,
    events."end",
    events.description,
    events.price,
    events.created,
    events.account_id,
    events.photo,
    events.preview,
    events.category_id,
    events.type,
    events.video,
    favorites.created_by AS user_id
   FROM (public.favorites
     LEFT JOIN public.events ON ((events.id = favorites.event_id)));
CREATE TABLE public.links (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    name text NOT NULL,
    link text NOT NULL,
    enabled boolean NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL
);
CREATE VIEW public.members AS
 SELECT accounts_users.id,
    accounts.id AS account_id,
    users.id AS user_id,
    accounts.name AS account_name,
    accounts.username,
    users.first_name,
    users.last_name,
    accounts_users.created,
    accounts_users.created_by
   FROM ((public.accounts_users
     LEFT JOIN public.users ON ((users.id = accounts_users.user_id)))
     LEFT JOIN public.accounts ON ((accounts.id = accounts_users.account_id)))
  ORDER BY accounts.name;
CREATE TABLE public.playlists (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    account_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now(),
    created_by uuid NOT NULL
);
CREATE VIEW public.presence AS
 SELECT views.event_id,
    views.user_id,
    max(views.created) AS last_seen
   FROM public.views
  WHERE (views.created >= (now() - '00:05:00'::interval))
  GROUP BY views.user_id, views.event_id;
CREATE VIEW public.presence_events AS
 SELECT presence.event_id,
    count(*) AS count
   FROM public.presence
  GROUP BY presence.event_id;
CREATE TABLE public.shopify_hooks (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    topic text NOT NULL,
    data jsonb NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);
CREATE VIEW public.supporters_report AS
 SELECT transactions.account_id,
    users.id AS user_id,
    users.first_name,
    users.last_name,
    sum(transactions.price) AS total
   FROM (public.transactions
     LEFT JOIN public.users ON ((users.id = transactions.user_id)))
  GROUP BY transactions.account_id, users.id, users.first_name, users.last_name;
CREATE TABLE public.tags (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    name text NOT NULL,
    created_by uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);
CREATE VIEW public.transactions_owner AS
 SELECT transactions.user_id,
    transactions.event_id,
    transactions.created,
    transactions.id,
    transactions.price,
    transactions.ref,
    transactions.email,
    transactions.affiliate_id,
    transactions.account_id,
    transactions.is_tip
   FROM public.transactions;
CREATE VIEW public.transactions_report AS
 SELECT transactions.id,
    users.first_name,
    users.last_name,
    accounts.name AS account_name,
    events.name AS event_name,
    transactions.price,
    transactions.created
   FROM (((public.transactions
     LEFT JOIN public.users ON ((users.id = transactions.user_id)))
     LEFT JOIN public.events ON ((events.id = transactions.event_id)))
     LEFT JOIN public.accounts ON ((accounts.id = events.account_id)));
CREATE VIEW public.users_access_valid AS
 SELECT users_access.id,
    users_access.user_id,
    users_access.event_id,
    users_access.account_id,
    users_access.expiry,
    users_access.created,
    users_access.updated,
    users_access.email,
    users_access.subscription,
    users_access.product_id
   FROM public.users_access
  WHERE (users_access.expiry > now());
CREATE VIEW public.view_report AS
 SELECT views.event_id,
    views.city,
    views.region,
    views.country,
    count(*) AS count,
    views.account_id
   FROM public.views
  GROUP BY views.city, views.region, views.country, views.event_id, views.account_id;
ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_unique UNIQUE (account_id, user_id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_mux_id_key UNIQUE (mux_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events_playlists
    ADD CONSTRAINT events_playlists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events_products
    ADD CONSTRAINT events_products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events_tags
    ADD CONSTRAINT events_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_video_key UNIQUE (video);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_event_id_created_by_key UNIQUE (event_id, created_by);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shopify_hooks
    ADD CONSTRAINT shopify_hooks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.followers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.followers
    ADD CONSTRAINT subscriptions_account_id_user_id_key UNIQUE (account_id, user_id);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users_access
    ADD CONSTRAINT users_access_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_code_key UNIQUE (code);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_sub_key UNIQUE (sub);
ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX accounts_username_idx ON public.accounts USING btree (upper(username));
ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.access_codes
    ADD CONSTRAINT access_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_playlists
    ADD CONSTRAINT events_playlists_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_playlists
    ADD CONSTRAINT events_playlists_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_playlists
    ADD CONSTRAINT events_playlists_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_products
    ADD CONSTRAINT events_products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_products
    ADD CONSTRAINT events_products_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_products
    ADD CONSTRAINT events_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_tags
    ADD CONSTRAINT events_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_tags
    ADD CONSTRAINT events_tags_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events_tags
    ADD CONSTRAINT events_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.followers
    ADD CONSTRAINT subscribers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_access
    ADD CONSTRAINT users_access_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_access
    ADD CONSTRAINT users_access_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_access
    ADD CONSTRAINT users_access_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_access
    ADD CONSTRAINT users_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_affiliate_account_id_fkey FOREIGN KEY (affiliate_account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_affiliate_user_id_fkey FOREIGN KEY (affiliate_user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;
