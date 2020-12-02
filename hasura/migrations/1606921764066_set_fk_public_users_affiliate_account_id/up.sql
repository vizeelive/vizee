alter table "public"."users"
           add constraint "users_affiliate_account_id_fkey"
           foreign key ("affiliate_account_id")
           references "public"."accounts"
           ("id") on update restrict on delete restrict;
