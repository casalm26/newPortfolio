-- Test data for integration tests
INSERT INTO users (id, email, password_hash, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'testuser1@example.com', '$2b$10$hash1', 'Test User 1'),
  ('550e8400-e29b-41d4-a716-446655440001', 'testuser2@example.com', '$2b$10$hash2', 'Test User 2');

INSERT INTO posts (id, title, content, user_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'Test Post 1', 'Content 1', '550e8400-e29b-41d4-a716-446655440000'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Test Post 2', 'Content 2', '550e8400-e29b-41d4-a716-446655440001');