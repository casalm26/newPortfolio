// MongoDB initialization script for testing
db = db.getSiblingDB("testdb");

// Create test collections and data
db.users.insertMany([
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    email: "testuser1@example.com",
    password_hash: "$2b$10$hash1",
    name: "Test User 1",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    email: "testuser2@example.com",
    password_hash: "$2b$10$hash2",
    name: "Test User 2",
    created_at: new Date(),
    updated_at: new Date(),
  },
]);

db.posts.insertMany([
  {
    _id: ObjectId("507f1f77bcf86cd799439021"),
    title: "Test Post 1",
    content: "Content 1",
    user_id: ObjectId("507f1f77bcf86cd799439011"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    title: "Test Post 2",
    content: "Content 2",
    user_id: ObjectId("507f1f77bcf86cd799439012"),
    created_at: new Date(),
    updated_at: new Date(),
  },
]);

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ user_id: 1 });
db.posts.createIndex({ created_at: -1 });
