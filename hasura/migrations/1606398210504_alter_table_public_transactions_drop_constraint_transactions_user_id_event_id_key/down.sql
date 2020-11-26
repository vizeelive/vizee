alter table "public"."transactions" add constraint "transactions_user_id_event_id_key" unique ("user_id", "event_id");
