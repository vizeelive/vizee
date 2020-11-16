alter table "public"."tiers" drop constraint "tiers_account_id_fkey",
          add constraint "tiers_account_id_fkey"
          foreign key ("account_id")
          references "public"."accounts"
          ("id")
          on update restrict
          on delete restrict;
