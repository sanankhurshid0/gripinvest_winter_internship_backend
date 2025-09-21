const request = require("supertest");
const app = require("../index");
const { pool } = require("../config/database");

describe("Investments Endpoints", () => {
  let authToken;
  let testUserId;
  let productId;

  beforeAll(async () => {
    // Create test user and get auth token
    const userData = {
      first_name: "Investment",
      last_name: "Tester",
      email: "investmenttester@example.com",
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

    // Get a product for testing investments
    const productsResponse = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${authToken}`);

    if (productsResponse.body.products.length > 0) {
      productId = productsResponse.body.products[0].id;
    }
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query("DELETE FROM investments WHERE user_id = ?", [testUserId]);
    await pool.query("DELETE FROM users WHERE email = ?", [
      "investmenttester@example.com",
    ]);
    await pool.end();
  });

  describe("POST /api/investments", () => {
    it("should create a new investment with valid data", async () => {
      if (!productId) {
        console.warn("No products available for testing");
        return;
      }

      const investmentData = {
        product_id: productId,
        amount: 10000,
      };

      const response = await request(app)
        .post("/api/investments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(investmentData)
        .expect(201);

      expect(response.body.message).toBe("Investment created successfully");
      expect(response.body.investment).toBeDefined();
      expect(response.body.investment.amount).toBe(10000);
      expect(response.body.investment.expected_return).toBeGreaterThan(10000);
    });

    it("should return 400 for amount below minimum", async () => {
      if (!productId) {
        console.warn("No products available for testing");
        return;
      }

      const investmentData = {
        product_id: productId,
        amount: 500, // Below minimum of 1000
      };

      const response = await request(app)
        .post("/api/investments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(investmentData)
        .expect(400);

      expect(response.body.message).toBe("Minimum investment amount is ₹1,000");
    });

    it("should return 400 for missing product_id", async () => {
      const investmentData = {
        amount: 10000,
        // Missing product_id
      };

      const response = await request(app)
        .post("/api/investments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(investmentData)
        .expect(400);

      expect(response.body.message).toBe("Product ID is required");
    });

    it("should return 404 for non-existent product", async () => {
      const investmentData = {
        product_id: "00000000-0000-0000-0000-000000000000",
        amount: 10000,
      };

      const response = await request(app)
        .post("/api/investments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(investmentData)
        .expect(404);

      expect(response.body.message).toBe("Investment product not found");
    });

    it("should return 401 without token", async () => {
      const investmentData = {
        product_id: productId,
        amount: 10000,
      };

      const response = await request(app)
        .post("/api/investments")
        .send(investmentData)
        .expect(401);

      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("GET /api/investments", () => {
    it("should return user investments with portfolio summary", async () => {
      const response = await request(app)
        .get("/api/investments")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.investments).toBeDefined();
      expect(response.body.portfolio_summary).toBeDefined();
      expect(Array.isArray(response.body.investments)).toBe(true);

      expect(response.body.portfolio_summary.total_invested).toBeDefined();
      expect(
        response.body.portfolio_summary.total_expected_return
      ).toBeDefined();
      expect(response.body.portfolio_summary.total_gain).toBeDefined();
      expect(response.body.portfolio_summary.active_investments).toBeDefined();
    });

    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/investments").expect(401);

      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("GET /api/investments/:investmentId", () => {
    let investmentId;

    beforeAll(async () => {
      // Get an investment ID from user's investments
      const investmentsResponse = await request(app)
        .get("/api/investments")
        .set("Authorization", `Bearer ${authToken}`);

      if (investmentsResponse.body.investments.length > 0) {
        investmentId = investmentsResponse.body.investments[0].id;
      }
    });

    it("should return specific investment details", async () => {
      if (!investmentId) {
        console.warn("No investments available for testing");
        return;
      }

      const response = await request(app)
        .get(`/api/investments/${investmentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.investment).toBeDefined();
      expect(response.body.investment.id).toBe(investmentId);
    });

    it("should return 404 for non-existent investment", async () => {
      const fakeId = "999999";
      const response = await request(app)
        .get(`/api/investments/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe("Investment not found");
    });
  });

  describe("PATCH /api/investments/:investmentId/cancel", () => {
    let investmentId;

    beforeAll(async () => {
      // Create a fresh investment for cancellation testing
      if (productId) {
        const investmentResponse = await request(app)
          .post("/api/investments")
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            product_id: productId,
            amount: 5000,
          });

        if (investmentResponse.status === 201) {
          investmentId = investmentResponse.body.investment.id;
        }
      }
    });

    it("should cancel investment within 24 hours", async () => {
      if (!investmentId) {
        console.warn("No investment available for cancellation testing");
        return;
      }

      const response = await request(app)
        .patch(`/api/investments/${investmentId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe("Investment cancelled successfully");
    });

    it("should return 400 for already cancelled investment", async () => {
      if (!investmentId) {
        console.warn("No investment available for cancellation testing");
        return;
      }

      const response = await request(app)
        .patch(`/api/investments/${investmentId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.message).toBe(
        "Only active investments can be cancelled"
      );
    });

    it("should return 404 for non-existent investment", async () => {
      const fakeId = "999999";
      const response = await request(app)
        .patch(`/api/investments/${fakeId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe("Investment not found");
    });
  });
});
