const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Invalid email or password"));
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(ApiError.badRequest("User with this email already exists"));
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        role,
        password: hashPassword,
      });
      await Basket.create({ userId: newUser.id });

      const token = generateJwt(newUser.id, newUser.email, newUser.role);
      return res.json({ token });
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest("User not found"));
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        return next(ApiError.badRequest("Incorrect password"));
      }

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async check(req, res, next) {
    const { id, email, role } = req.user;

    try {
      const token = generateJwt(id, email, role);
      return res.json({ token });
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }
}

module.exports = new UserController();
