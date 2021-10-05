ALTER TABLE ONLY "public"."events_playlists" ALTER COLUMN "created" DROP DEFAULT;
ALTER TABLE "public"."events_playlists" ALTER COLUMN "created" SET NOT NULL;
