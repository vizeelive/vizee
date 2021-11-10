ALTER TABLE "public"."posts" ADD COLUMN "attachments" jsonb;
ALTER TABLE "public"."posts" ALTER COLUMN "attachments" DROP NOT NULL;
