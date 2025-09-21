const request = require("supertest");
const app = require("../index");
const { pool } = require("../config/database");

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email LIKE "%test%"');
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email LIKE "%test%"');
    await pool.end();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        password: "password123",
        risk_appetite: "moderate",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe("User created successfully");
      expect(response.body.userId).toBeDefined();
    });

    it("should return 400 for missing required fields", async () => {
      const userData = {
        email: "test2@example.com",
        password: "password123",
        // missing first_name
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain(
        "First name must be at least 2 characters long"
      );
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        first_name: "Test",
        email: "test@example.com", // Same email as above
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe("Email already exists");
    });

    it("should return 400 for invalid email format", async () => {
      const userData = {
        first_name: "Test",
        email: "invalid-email",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe("Valid email address is required");
    });

    it("should return 400 for short password", async () => {
      const userData = {
        first_name: "Test",
        email: "test3@example.com",
        password: "123", // Too short
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe(
        "Password must be at least 6 characters long"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.password_hash).toBeUndefined(); // Should not include password
    });

    it("should return 401 for invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return 401 for invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return 400 for missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body.message).toBe("Email and password are required");
    });
  });

  describe("GET /api/auth/profile", () => {
    let authToken;

    beforeAll(async () => {
      // Login to get auth token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
      authToken = loginResponse.body.token;
    });

    it("should return user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.password_hash).toBeUndefined();
    });

    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.message).toBe("Access token required");
    });

    it("should return 403 with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(403);

      expect(response.body.message).toBe("Invalid or expired token");
    });
  });
});
