ALTER TABLE ONLY "public"."stripe_subscriptions" ALTER COLUMN "updated" SET DEFAULT now();
ALTER TABLE "public"."stripe_subscriptions" ALTER COLUMN "updated" DROP NOT NULL;
