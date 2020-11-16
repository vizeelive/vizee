alter table "public"."followers" drop constraint "followers_account_id_fkey",
          add constraint "subscribers_account_id_fkey"
          foreign key ("account_id")
          references "public"."accounts"
          ("id")
          on update restrict
          on delete restrict;
