CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."subscribers"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "account_id" uuid NOT NULL, "user_id" text NOT NULL, "created" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
