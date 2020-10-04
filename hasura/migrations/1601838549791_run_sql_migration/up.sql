CREATE VIEW category_counts AS
SELECT categories.id, categories.name, counts.count FROM
(SELECT category_id, COUNT(*) AS count
FROM events 
GROUP BY category_id) AS counts
LEFT JOIN categories ON categories.id = counts.category_id;
