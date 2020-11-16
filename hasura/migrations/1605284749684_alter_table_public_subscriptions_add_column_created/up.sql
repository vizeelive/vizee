ALTER TABLE "public"."subscriptions" ADD COLUMN "created" timestamptz NULL DEFAULT now();
