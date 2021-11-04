CREATE OR REPLACE VIEW images AS
SELECT
	account_id,
	data ->> 'url' AS url,
	data ->> 'audience' AS audience,
	date,
	created
FROM (
	SELECT
		account_id,
		date,
		created,
		jsonb_array_elements(attachments) AS data
	FROM
		posts) attachments
WHERE
	data ->> 'type' = 'image';
