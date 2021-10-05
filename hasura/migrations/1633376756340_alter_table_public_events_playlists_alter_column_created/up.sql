ALTER TABLE ONLY "public"."events_playlists" ALTER COLUMN "created" SET DEFAULT now();
ALTER TABLE "public"."events_playlists" ALTER COLUMN "created" DROP NOT NULL;
