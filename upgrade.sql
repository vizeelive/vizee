ALTER TABLE access_codes DROP CONSTRAINT access_codes_user_id_fkey;
ALTER TABLE access_codes DROP CONSTRAINT access_codes_created_by_fkey;
ALTER TABLE accounts_users DROP CONSTRAINT accounts_users_user_id_fkey;
ALTER TABLE comments DROP CONSTRAINT comments_created_by_fkey;
ALTER TABLE events DROP CONSTRAINT events_created_by_fkey;
ALTER TABLE followers DROP CONSTRAINT subscribers_user_id_fkey;
ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_user_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT transactions_user_id_fkey;

ALTER TABLE access_codes ALTER COLUMN user_id TYPE UUID USING created_by::uuid;
ALTER TABLE access_codes ALTER COLUMN created_by TYPE UUID USING created_by::uuid;

DROP VIEW members;
DROP VIEW transactions_report;
DROP VIEW events_report;
DROP VIEW favorite_events;
DROP VIEW presence_events;
DROP VIEW presence;

UPDATE users SET sub=id;
UPDATE users SET id=gen_random_uuid();
ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::uuid;

UPDATE accounts_users SET user_id=users.id FROM users WHERE users.sub=accounts_users.user_id;
UPDATE accounts_users SET created_by=users.id FROM users WHERE users.sub=accounts_users.created_by;
UPDATE comments SET created_by=users.id FROM users WHERE users.sub=comments.created_by;
UPDATE events SET created_by=users.id FROM users WHERE users.sub=events.created_by;
UPDATE links SET created_by=users.id FROM users WHERE users.sub=links.created_by;
UPDATE tiers SET created_by=users.id FROM users WHERE users.sub=tiers.created_by;
UPDATE views SET created_by=users.id FROM users WHERE users.sub=views.created_by;
UPDATE views SET user_id=users.id FROM users WHERE users.sub=views.user_id;
UPDATE favorites SET created_by=users.id FROM users WHERE users.sub=favorites.created_by;
UPDATE followers SET user_id=users.id FROM users WHERE users.sub=followers.user_id;
UPDATE subscriptions SET user_id=users.id FROM users WHERE users.sub=subscriptions.user_id;
UPDATE transactions SET user_id=users.id FROM users WHERE users.sub=transactions.user_id;

ALTER TABLE accounts_users ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE accounts_users ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE comments ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE events ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE links ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE favorites ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE tiers ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE views ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
ALTER TABLE views ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE followers ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE subscriptions ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE transactions ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

ALTER TABLE access_codes ADD CONSTRAINT "access_codes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE access_codes ADD CONSTRAINT "access_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE accounts_users CONSTRAINT "accounts_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE comments ADD CONSTRAINT "comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE events ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE followers ADD CONSTRAINT "subscribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE suscriptions ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE transactions ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE OR REPLACE VIEW members AS  SELECT accounts_users.id,
    accounts.id AS account_id,
    users.id AS user_id,
    accounts.name AS account_name,
    accounts.username,
    users.first_name,
    users.last_name,
    accounts_users.created,
    accounts_users.created_by
   FROM accounts_users
     LEFT JOIN users ON users.id = accounts_users.user_id
     LEFT JOIN accounts ON accounts.id = accounts_users.account_id
  ORDER BY accounts.name;

CREATE OR REPLACE VIEW transactions_report AS
 SELECT transactions.id,
    users.first_name,
    users.last_name,
    accounts.name AS account_name,
    events.name AS event_name,
    transactions.price,
    transactions.created
   FROM transactions
     LEFT JOIN users ON users.id = transactions.user_id
     LEFT JOIN events ON events.id = transactions.event_id
     LEFT JOIN accounts ON accounts.id = events.account_id;

CREATE OR REPLACE VIEW events_report AS
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
           FROM transactions
          WHERE transactions.event_id = events.id) AS transactions,
    ( SELECT count(*) AS count
           FROM favorites
          WHERE favorites.event_id = events.id) AS favorites,
    ( SELECT count(*) AS count
           FROM views
          WHERE views.event_id = events.id
          GROUP BY views.event_id) AS views,
    events.type,
    events.video,
    events.location,
    ( SELECT sum(transactions.price) AS total
           FROM transactions
          WHERE transactions.event_id = events.id) AS revenue
   FROM events;

   CREATE OR REPLACE VIEW favorite_events AS
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
   FROM favorites
     LEFT JOIN events ON events.id = favorites.event_id;

CREATE OR REPLACE VIEW presence AS
 SELECT views.event_id,
    views.user_id,
    max(views.created) AS last_seen
   FROM views
  WHERE views.created >= (now() - '00:05:00'::interval)
  GROUP BY views.user_id, views.event_id;


CREATE OR REPLACE VIEW presence_events AS
 SELECT presence.event_id,
    count(*) AS count
   FROM presence
  GROUP BY presence.event_id
