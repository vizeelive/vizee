alter table "public"."users_access" add constraint "users_access_user_id_event_id_key" unique ("user_id", "event_id");
