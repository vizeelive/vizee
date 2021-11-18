alter table "public"."accounts_affiliates" add constraint "accounts_affiliates_account_id_email_key" unique ("account_id", "email");
