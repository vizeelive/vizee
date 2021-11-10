alter table "public"."posts_attachments" drop constraint "posts_attachments_post_id_fkey",
             add constraint "posts_attachments_post_id_fkey"
             foreign key ("post_id")
             references "public"."posts"
             ("id") on update cascade on delete cascade;
