alter table "public"."posts"
           add constraint "posts_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update restrict on delete restrict;
