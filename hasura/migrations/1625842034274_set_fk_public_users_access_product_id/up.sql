alter table "public"."users_access"
           add constraint "users_access_product_id_fkey"
           foreign key ("product_id")
           references "public"."products"
           ("id") on update restrict on delete restrict;
