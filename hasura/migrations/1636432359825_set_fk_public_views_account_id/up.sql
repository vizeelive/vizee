alter table "public"."views"
           add constraint "views_account_id_fkey"
           foreign key ("account_id")
           references "public"."accounts"
           ("id") on update restrict on delete restrict;
