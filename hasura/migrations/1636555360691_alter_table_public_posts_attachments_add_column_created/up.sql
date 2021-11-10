ALTER TABLE "public"."posts_attachments" ADD COLUMN "created" timestamptz NOT NULL DEFAULT now();
