alter table "public"."favorites" add constraint "favorites_event_id_created_by_key" unique ("event_id", "created_by");
