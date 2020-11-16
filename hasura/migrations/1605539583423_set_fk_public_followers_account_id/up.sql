alter table "public"."followers" drop constraint "subscribers_account_id_fkey",
             add constraint "followers_account_id_fkey"
             foreign key ("account_id")
             references "public"."accounts"
             ("id") on update cascade on delete cascade;
