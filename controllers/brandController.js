const { Brand } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }

  async deleteById(req, res, next) {
    const { id } = req.params;
    const deleted = await Brand.destroy({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return next(ApiError.badRequest("Brand not found"));
    }

    const brands = await Brand.findAll();
    return res.json(brands);
  }
}

module.exports = new BrandController();
