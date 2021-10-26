ALTER TABLE ONLY "public"."stripe_subscriptions" ALTER COLUMN "updated" DROP DEFAULT;
ALTER TABLE "public"."stripe_subscriptions" ALTER COLUMN "updated" SET NOT NULL;
