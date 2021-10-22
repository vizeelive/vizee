CREATE OR REPLACE VIEW account_costs AS
SELECT
	id,
	name,
	total_duration / 60 AS total_duration_minutes,
	round(total_size / (1000 * 1000 * 1000)) As total_size_gb,
	encoding_cost,
	mux_storage_cost_monthly,
	s3_storage_cost_monthly,
	s3_egress_cost,
	transloadit_ingest_cost,
	encoding_cost + s3_egress_cost + transloadit_ingest_cost AS ingest_total,
	s3_storage_cost_monthly + mux_storage_cost_monthly As monthly_total
FROM (
	SELECT
		accounts.id,
		accounts.name,
		total_duration,
		total_size,
		cast((total_duration / 60) *.05 AS money) AS encoding_cost,
		cast((total_duration / 60) *.003 AS money) AS mux_storage_cost_monthly,
		cast((total_size / (1000 * 1000 * 1000)) *.023 AS money) AS s3_storage_cost_monthly,
		cast((total_size / (1000 * 1000 * 1000)) *.085 AS money) AS s3_egress_cost,
		cast((total_size / (1000 * 1000 * 1000)) *.166 AS money) * 2 AS transloadit_ingest_cost
	FROM
		accounts
	LEFT JOIN (
		SELECT
			events.account_id,
			SUM(duration) AS total_duration
		FROM
			events
		GROUP BY
			account_id) AS account_duration ON account_duration.account_id = accounts.id
	LEFT JOIN (
		SELECT
			events.account_id,
			SUM(size) AS total_size
		FROM
			events
		GROUP BY
			account_id) AS account_size ON account_size.account_id = accounts.id
	WHERE
		total_duration IS NOT NULL
	ORDER BY
		encoding_cost DESC) AS account_costs;
