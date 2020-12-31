ALTER TABLE ONLY "public"."users" ALTER COLUMN "code" SET DEFAULT 'random_string(7)';
ALTER TABLE "public"."users" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."users" ADD CONSTRAINT "users_code_key" UNIQUE ("code");
