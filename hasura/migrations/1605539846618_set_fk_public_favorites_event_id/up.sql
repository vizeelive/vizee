alter table "public"."favorites" drop constraint "favorites_event_id_fkey",
             add constraint "favorites_event_id_fkey"
             foreign key ("event_id")
             references "public"."events"
             ("id") on update cascade on delete cascade;
