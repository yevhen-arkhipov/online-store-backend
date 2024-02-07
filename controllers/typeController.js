const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const type = await Type.create({ name });
      return res.json(type);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const types = await Type.findAll();
      return res.json(types);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedType = await Type.destroy({
        where: {
          id: id,
        },
      });

      if (!deletedType) {
        return next(ApiError.badRequest("Type not found"));
      }

      const types = await Type.findAll();
      return res.json(types);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }
}

module.exports = new TypeController();
