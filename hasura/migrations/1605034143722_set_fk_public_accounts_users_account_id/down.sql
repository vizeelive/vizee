alter table "public"."accounts_users" drop constraint "accounts_users_account_id_fkey",
          add constraint "accounts_users_account_id_fkey"
          foreign key ("account_id")
          references "public"."accounts"
          ("id")
          on update restrict
          on delete restrict;
