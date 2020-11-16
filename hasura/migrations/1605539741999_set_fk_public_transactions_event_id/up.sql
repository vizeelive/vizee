alter table "public"."transactions" drop constraint "transactions_event_id_fkey",
             add constraint "transactions_event_id_fkey"
             foreign key ("event_id")
             references "public"."events"
             ("id") on update cascade on delete cascade;
