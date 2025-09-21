const validateSignup = (req, res, next) => {
  const { first_name, email, password } = req.body;

  if (!first_name || first_name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "First name must be at least 2 characters long" });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email address is required" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  next();
};

const validateInvestment = (req, res, next) => {
  const { product_id, amount } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!amount || amount < 1000) {
    return res
      .status(400)
      .json({ message: "Minimum investment amount is ₹1,000" });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateSignup,
  validateLogin,
  validateInvestment,
};
