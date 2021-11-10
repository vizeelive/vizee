CREATE OR REPLACE VIEW images AS
 SELECT
	posts_attachments.id,
	posts_attachments.type,
	posts_attachments.mime,
	posts_attachments.url,
	posts_attachments.preview,
	posts_attachments.cover,
	posts_attachments.event_id,
	posts_attachments.post_id,
	posts_attachments.created,
	posts_attachments.created_by,
	COALESCE(accounts.id, event_account.id) AS account_id
FROM
	posts_attachments
	LEFT JOIN posts ON posts.id = posts_attachments.post_id
	LEFT JOIN accounts ON accounts.id = posts.account_id
	LEFT JOIN events ON events.id = posts.event_id
	LEFT JOIN accounts AS event_account ON event_account.id = events.account_id
WHERE
	posts_attachments.type = 'image'::text;
