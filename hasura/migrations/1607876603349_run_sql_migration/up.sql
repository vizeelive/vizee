CREATE VIEW users_access_valid AS
SELECT * FROM users_access WHERE expiry > NOW();
