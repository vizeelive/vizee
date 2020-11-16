CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."subscriptions"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "tier_id" uuid NOT NULL, "user_id" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
