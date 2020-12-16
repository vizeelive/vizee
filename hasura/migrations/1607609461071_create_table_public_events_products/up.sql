CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."events_products"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "event_id" uuid NOT NULL, "product_id" uuid NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
