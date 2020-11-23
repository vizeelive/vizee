CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."links"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "account_id" uuid NOT NULL, "name" text NOT NULL, "link" text NOT NULL, "enabled" bool NOT NULL, "created" timestamptz NOT NULL, "created_by" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON UPDATE cascade ON DELETE cascade);
