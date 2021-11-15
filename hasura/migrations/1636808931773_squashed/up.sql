
ALTER TABLE "public"."accounts" ADD COLUMN "affiliate_commission" integer NULL;

ALTER TABLE ONLY "public"."accounts" ALTER COLUMN "affiliate_commission" SET DEFAULT 10;
