CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."shopify_hooks"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "topic" text NOT NULL, "data" jsonb NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
