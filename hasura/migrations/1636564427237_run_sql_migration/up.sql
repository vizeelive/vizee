CREATE OR REPLACE VIEW images AS
SELECT
	posts_attachments.*,
	account_id
FROM
	posts_attachments
	LEFT JOIN posts ON posts.id = posts_attachments.post_id
	LEFT JOIN accounts ON accounts.id = posts.account_id
WHERE
	TYPE = 'image';
