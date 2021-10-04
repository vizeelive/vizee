ALTER TABLE "public"."events" ADD COLUMN "tags" jsonb NULL DEFAULT jsonb_build_array();
