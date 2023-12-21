const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }

  async deleteById(req, res, next) {
    const { id } = req.params;
    const deleted = await Type.destroy({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return next(ApiError.badRequest("Type not found"));
    }

    const types = await Type.findAll();
    return res.json(types);
  }
}

module.exports = new TypeController();
