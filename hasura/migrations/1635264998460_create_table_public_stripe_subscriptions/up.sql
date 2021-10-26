CREATE TABLE "public"."stripe_subscriptions"("id" text NOT NULL, "data" jsonb NOT NULL, "created" timestamptz NOT NULL, "updated" timestamptz NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
