CREATE TABLE "public"."stripe_payouts"("id" text NOT NULL, "data" jsonb NOT NULL, "created" timestamptz DEFAULT now(), "updated" timestamptz DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
