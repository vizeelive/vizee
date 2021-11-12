alter table "public"."users"
           add constraint "users_payout_account_id_fkey"
           foreign key ("payout_account_id")
           references "public"."accounts"
           ("id") on update restrict on delete restrict;
