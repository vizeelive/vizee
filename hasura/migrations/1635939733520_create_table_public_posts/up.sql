CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."posts"("id" uuid DEFAULT gen_random_uuid(), "message" text NOT NULL, "created_by" uuid NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
