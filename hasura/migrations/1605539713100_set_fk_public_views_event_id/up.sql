alter table "public"."views" drop constraint "views_event_id_fkey",
             add constraint "views_event_id_fkey"
             foreign key ("event_id")
             references "public"."events"
             ("id") on update cascade on delete cascade;
