CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."tiers"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "account_id" uuid NOT NULL, "name" text NOT NULL, "price" money NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), "created_by" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON UPDATE restrict ON DELETE restrict);