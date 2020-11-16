alter table "public"."favorites" drop constraint "favorites_account_id_fkey",
          add constraint "favorites_account_id_fkey"
          foreign key ("account_id")
          references "public"."accounts"
          ("id")
          on update restrict
          on delete restrict;
