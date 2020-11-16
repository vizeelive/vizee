alter table "public"."events" drop constraint "events_account_id_fkey",
          add constraint "events_account_id_fkey"
          foreign key ("account_id")
          references "public"."accounts"
          ("id")
          on update restrict
          on delete restrict;
