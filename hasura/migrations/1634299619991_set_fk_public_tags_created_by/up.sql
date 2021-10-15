alter table "public"."tags"
           add constraint "tags_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update restrict on delete restrict;
