alter table "public"."posts_attachments"
           add constraint "posts_attachments_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update restrict on delete restrict;
