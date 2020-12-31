ALTER TABLE ONLY "public"."users" ALTER COLUMN "code" SET DEFAULT ''random_string(7)'::text';
ALTER TABLE "public"."users" ALTER COLUMN "code" DROP NOT NULL;
