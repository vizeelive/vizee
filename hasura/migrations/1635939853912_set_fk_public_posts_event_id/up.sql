alter table "public"."posts"
           add constraint "posts_event_id_fkey"
           foreign key ("event_id")
           references "public"."events"
           ("id") on update restrict on delete restrict;
