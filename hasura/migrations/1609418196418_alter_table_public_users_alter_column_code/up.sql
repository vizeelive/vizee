ALTER TABLE "public"."users" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "code" SET NOT NULL;
