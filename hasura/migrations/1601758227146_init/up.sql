CREATE FUNCTION public.account_default_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
		 INSERT INTO accounts_users(account_id,user_id)
		 VALUES(NEW.id, NEW.created_by);
	RETURN NEW;
END;
$$;
CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    photo text NOT NULL,
    created_by text,
    created timestamp with time zone DEFAULT now(),
    username text,
    description text,
    instagram text,
    twitter text,
    facebook text
);
CREATE TABLE public.accounts_users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    user_id text NOT NULL
);
CREATE TABLE public.categories (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.events (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_by text,
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
    video text
);
CREATE TABLE public.favorites (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    event_id uuid,
    account_id uuid,
    created timestamp with time zone DEFAULT now(),
    created_by text
);
CREATE TABLE public.transactions (
    user_id text NOT NULL,
    event_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
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
          WHERE (favorites.event_id = events.id)) AS favorites
   FROM public.events;
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
CREATE TABLE public.users (
    id text NOT NULL,
    first_name text,
    last_name text,
    created timestamp with time zone DEFAULT now(),
    name text
);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
