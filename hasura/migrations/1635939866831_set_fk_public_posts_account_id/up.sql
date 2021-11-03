alter table "public"."posts"
           add constraint "posts_account_id_fkey"
           foreign key ("account_id")
           references "public"."accounts"
           ("id") on update restrict on delete restrict;
