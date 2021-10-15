CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."tags"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "account_id" uuid NOT NULL, "name" text NOT NULL, "created_by" uuid NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
