alter table "public"."subscriptions" add constraint "subscriptions_account_id_user_id_key" unique ("account_id", "user_id");
