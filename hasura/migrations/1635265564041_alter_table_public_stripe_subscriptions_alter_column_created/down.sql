ALTER TABLE ONLY "public"."stripe_subscriptions" ALTER COLUMN "created" DROP DEFAULT;
ALTER TABLE "public"."stripe_subscriptions" ALTER COLUMN "created" SET NOT NULL;
