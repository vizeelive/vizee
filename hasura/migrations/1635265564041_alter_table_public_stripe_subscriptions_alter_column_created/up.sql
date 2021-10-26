ALTER TABLE ONLY "public"."stripe_subscriptions" ALTER COLUMN "created" SET DEFAULT now();
ALTER TABLE "public"."stripe_subscriptions" ALTER COLUMN "created" DROP NOT NULL;
