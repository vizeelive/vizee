INSERT INTO "public"."accounts" ("id", "name", "photo", "created_by", "created", "username", "description", "instagram", "twitter", "facebook", "stripe_data", "stripe_id", "subscription_rate", "fee_percent", "umami_id", "umami_website", "tpl_color", "tpl_backgroundcolor", "tpl_primarycolor", "umami_username", "domain", "logo", "whitelabel", "shopify_domain", "shopify_storefront_token", "shopify_token", "mattermost_channel_id", "preview") VALUES
('cc54e7a2-e398-4eda-9807-877bf3536dbb', 'jeff@loiselles.com''s Channel', NULL, '1f0c117c-eae5-471b-93d7-d60df74074b7', '2021-10-28 18:24:33.729331+00', 'jeff', 'I am a description', 'https://instagram.com/phishy', 'https://twitter.com/phishy', 'https://facebook.com/phishy', NULL, NULL, 0, 20, 1186, '0b1a4234-6d52-4c06-ad34-2922f882dbd9', NULL, NULL, NULL, '0a7a37d9-2e6d-4497-b528-13333d308aa2', NULL, NULL, 'f', NULL, NULL, NULL, '88k3jx9dhtfszrk13hrwswzkhy', NULL),
('0ba2d273-69eb-449a-ad42-7a5e7aaabb8c', 'jeff@viz.ee''s Channel', NULL, '3f739bc5-9b01-4c40-bee5-fddb18fff457', '2021-10-28 18:29:32.335518+00', 'WiIzWJ5hYD', NULL, NULL, NULL, NULL, NULL, NULL, 0, 20, 1187, 'a9f766ec-9de1-44f3-b922-c13d955ea03c', NULL, NULL, NULL, 'e4a2ace9-bc77-4f54-90d4-2c8945f93e04', NULL, NULL, 'f', NULL, NULL, NULL, 'tc7q7ztfatr4zb7fsgcb45saqc', NULL);

INSERT INTO "public"."users" ("id", "first_name", "last_name", "created", "name", "city", "state", "country", "sub", "email", "affiliate_account_id", "affiliate_user_id", "stripe_customer_id", "code") VALUES
('1f0c117c-eae5-471b-93d7-d60df74074b7', 'Jeff', 'Loiselle', '2021-10-28 18:24:29.01843+00', 'jeff@loiselles.com''s Channel', NULL, NULL, NULL, 'email|jeff@loiselles.com', 'jeff@loiselles.com', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', '1f0c117c-eae5-471b-93d7-d60df74074b7', NULL, 'luWwVf295g'),
('3f739bc5-9b01-4c40-bee5-fddb18fff457', 'Admin', 'User', '2021-10-28 18:29:28.723726+00', 'jeff@viz.ee''s Channel', NULL, NULL, NULL, 'email|jeff@viz.ee', 'jeff@viz.ee', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', '1f0c117c-eae5-471b-93d7-d60df74074b7', NULL, 'iea2hwDP3B');


INSERT INTO "public"."accounts_users" ("id", "account_id", "user_id", "created_by", "created", "email") VALUES
('cf19afca-c04b-4da9-b096-f81d20662fc5', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', '1f0c117c-eae5-471b-93d7-d60df74074b7', NULL, '2021-10-28 18:24:33.729331+00', NULL),
('3bc0da6f-d048-4136-a611-f34f1e9d1e98', '0ba2d273-69eb-449a-ad42-7a5e7aaabb8c', '3f739bc5-9b01-4c40-bee5-fddb18fff457', NULL, '2021-10-28 18:29:32.335518+00', NULL);

INSERT INTO "public"."categories" ("id", "name") VALUES
('04b46af7-8d4a-425d-a713-668b99808612', 'Dance'),
('06a15dcd-03cb-4dcd-b052-b9d8a84212cc', 'Music'),
('0cf15a4d-8687-4a73-a00d-a04a89e39e8c', 'Autos & Vehicles'),
('162c9a29-719d-4a05-a3aa-01bf788f256f', 'Science & Technology'),
('265ffd0d-96b7-4073-be46-7504fa24ce1f', 'Film & Animation'),
('501f9061-841b-42b5-a8ac-bfa0b9d951aa', 'News & Politics'),
('64996528-7401-4405-bb19-928a1220957a', 'Travel & Events'),
('7c59eec9-f0c8-4a4f-a823-3e07f3f3f81e', 'Health & Wellness'),
('7f4d616d-0364-43ce-8f7a-57d608c6682d', 'Education'),
('ac1730d3-97c7-47e9-abc4-b68c999152ef', 'Entertainment'),
('ba464c6b-b97a-4003-a2e4-8e3fed1fbe5c', 'Pets & Animals'),
('bd91d4f8-d7d7-444a-a233-3fb058afae3c', 'Howto & Style'),
('cde5e2cf-a103-4ef7-af44-a3e77cf798dc', 'Sports'),
('ce7d43ee-7627-4d36-8ec0-17f6dd9e4d41', 'People & Blogs'),
('d1352bc2-b428-40f2-9174-e0e58fe0ef7b', 'Gaming'),
('da986f2b-6db8-414d-ac31-e02099b5761b', 'Comedy'),
('efd1a9c4-6761-4acb-ac24-262762aec0a5', 'Nonprofits & Activism');

INSERT INTO "public"."events" ("id", "name", "created_by", "start", "end", "description", "price", "created", "account_id", "photo", "preview", "category_id", "type", "video", "location", "mux_livestream", "mux_id", "status", "location_pos", "published", "thumb", "mux_asset_id", "account_only", "on_network", "stream_type", "ivs_channel_arn", "tags_old", "duration", "size") VALUES
('097d733d-9000-4db1-9db2-3ea7810e4a5e', 'Video', '1f0c117c-eae5-471b-93d7-d60df74074b7', '2021-10-28 18:26:16.774+00', '2039-10-21 18:26:16.774+00', NULL, NULL, '2021-10-28 18:27:28.588037+00', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', NULL, NULL, '06a15dcd-03cb-4dcd-b052-b9d8a84212cc', 'video', 'https://vizee-media.s3.amazonaws.com/66/1f7e11080547c4ab8992e9a103c13f/layers.mov', NULL, NULL, NULL, 'idle', NULL, 't', NULL, 'LclMd5yGuziTQTQZVON01CiATy5EGVANfXZAnpO6IxlM', 't', 't', 'mux', NULL, '[]', 21, 55227493);

INSERT INTO
    "public"."tags" (
        "id",
        "account_id",
        "name",
        "created_by",
        "created"
    )
VALUES
    (
        'f35702c6-d059-4252-b428-18bc8287f72d',
        'cc54e7a2-e398-4eda-9807-877bf3536dbb',
        'cool',
        '1f0c117c-eae5-471b-93d7-d60df74074b7',
        '2021-10-28 18:27:28.865047+00'
    ),
    (
        'bccb4c5c-c688-401a-8aa3-85d749bb4ae2',
        'cc54e7a2-e398-4eda-9807-877bf3536dbb',
        'tags',
        '1f0c117c-eae5-471b-93d7-d60df74074b7',
        '2021-10-28 18:27:28.865047+00'
    );
INSERT INTO "public"."events_tags" ("id", "event_id", "tag_id", "created_by", "created") VALUES
('afdc7b2e-f169-490e-ad4d-2ea9c1fa6549', '097d733d-9000-4db1-9db2-3ea7810e4a5e', 'f35702c6-d059-4252-b428-18bc8287f72d', '1f0c117c-eae5-471b-93d7-d60df74074b7', '2021-10-28 18:27:29.191727+00'),
('9df45c3f-7656-43c6-bd8a-1e2aa9b7e129', '097d733d-9000-4db1-9db2-3ea7810e4a5e', 'bccb4c5c-c688-401a-8aa3-85d749bb4ae2', '1f0c117c-eae5-471b-93d7-d60df74074b7', '2021-10-28 18:27:29.191727+00');

INSERT INTO "public"."products" ("id", "name", "description", "price", "flexible_price", "account_access", "recurring", "created", "created_by", "account_id", "access_length", "stripe_product_id", "download_access") VALUES
('8af7ae36-730c-4cd5-b5ae-97fe735d3227', 'Plan A', 'Plan A', '$1.99', 'f', 't', 't', '2021-10-28 18:28:31.486946+00', '1f0c117c-eae5-471b-93d7-d60df74074b7', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', 30, 'prod_KUcarPSyqFHcRz', 'f'),
('4b649b0d-498c-4d82-b355-ac545b8322b8', 'Plan B', 'Plan B', '$4.99', 'f', 't', 't', '2021-10-28 18:28:46.428882+00', '1f0c117c-eae5-471b-93d7-d60df74074b7', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', 30, 'prod_KUcahLeK5Xiwuw', 't'),
('9f132aeb-1da3-45ef-a690-76c57e2a8709', 'Plan C', 'Plan C', '$9.99', 'f', 't', 't', '2021-10-28 18:29:00.648293+00', '1f0c117c-eae5-471b-93d7-d60df74074b7', 'cc54e7a2-e398-4eda-9807-877bf3536dbb', 30, 'prod_KUcap9Ol5TgwLx', 't');

