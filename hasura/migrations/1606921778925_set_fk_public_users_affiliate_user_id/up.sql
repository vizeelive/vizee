alter table "public"."users"
           add constraint "users_affiliate_user_id_fkey"
           foreign key ("affiliate_user_id")
           references "public"."users"
           ("id") on update restrict on delete restrict;
