ALTER TABLE ONLY "public"."users" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "code" DROP NOT NULL;
ALTER TABLE "public"."users" DROP CONSTRAINT "users_code_key";
