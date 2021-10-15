alter table "public"."tags"
           add constraint "tags_account_id_fkey"
           foreign key ("account_id")
           references "public"."accounts"
           ("id") on update restrict on delete restrict;
