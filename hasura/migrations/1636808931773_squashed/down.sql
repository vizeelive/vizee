
ALTER TABLE ONLY "public"."accounts" ALTER COLUMN "affiliate_commission" DROP DEFAULT;

ALTER TABLE "public"."accounts" DROP COLUMN "affiliate_commission";
