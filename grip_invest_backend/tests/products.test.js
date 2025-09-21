const request = require("supertest");
const app = require("../index");
const { pool } = require("../config/database");

describe("Products Endpoints", () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Create test user and get auth token
    const userData = {
      first_name: "Product",
      last_name: "Tester",
      email: "producttester@example.com",
      password: "password123",
      risk_appetite: "moderate",
    };

    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send(userData);

    testUserId = signupResponse.body.userId;

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query("DELETE FROM users WHERE email = ?", [
      "producttester@example.com",
    ]);
    await pool.end();
  });

  describe("GET /api/products", () => {
    it("should return all products with valid token", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.products).toBeDefined();
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it("should filter products by risk level", async () => {
      const response = await request(app)
        .get("/api/products?risk_level=low")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.products).toBeDefined();
      response.body.products.forEach((product) => {
        expect(product.risk_level).toBe("low");
      });
    });

    it("should filter products by investment type", async () => {
      const response = await request(app)
        .get("/api/products?investment_type=bond")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.products).toBeDefined();
      response.body.products.forEach((product) => {
        expect(product.investment_type).toBe("bond");
      });
    });

    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/products").expect(401);

      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("GET /api/products/recommendations/for-me", () => {
    it("should return personalized recommendations", async () => {
      const response = await request(app)
        .get("/api/products/recommendations/for-me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.recommendations).toBeDefined();
      expect(response.body.risk_appetite).toBe("moderate");
      expect(Array.isArray(response.body.recommendations)).toBe(true);

      // Check that recommendations match user's risk appetite
      response.body.recommendations.forEach((product) => {
        expect(product.risk_level).toBe("moderate");
      });
    });
  });

  describe("GET /api/products/:productId", () => {
    let productId;

    beforeAll(async () => {
      // Get a product ID from the products list
      const productsResponse = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${authToken}`);

      if (productsResponse.body.products.length > 0) {
        productId = productsResponse.body.products[0].id;
      }
    });

    it("should return specific product details", async () => {
      if (!productId) {
        console.warn("No products available for testing");
        return;
      }

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.product).toBeDefined();
      expect(response.body.product.id).toBe(productId);
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe("Product not found");
    });
  });
});
