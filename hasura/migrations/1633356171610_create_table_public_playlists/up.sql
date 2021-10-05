CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."playlists"("id" uuid DEFAULT gen_random_uuid(), "name" text NOT NULL, "account_id" uuid NOT NULL, "created" timestamptz DEFAULT now(), "created_by" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
