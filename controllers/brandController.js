const { Brand } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const brands = await Brand.findAll();
      return res.json(brands);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBrand = await Brand.destroy({
        where: {
          id: id,
        },
      });

      if (!deletedBrand) {
        return next(ApiError.badRequest("Brand not found"));
      }

      const brands = await Brand.findAll();
      return res.json(brands);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }
}

module.exports = new BrandController();
