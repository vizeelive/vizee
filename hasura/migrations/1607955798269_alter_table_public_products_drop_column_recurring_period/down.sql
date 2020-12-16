ALTER TABLE "public"."products" ADD COLUMN "recurring_period" int4;
ALTER TABLE "public"."products" ALTER COLUMN "recurring_period" DROP NOT NULL;
