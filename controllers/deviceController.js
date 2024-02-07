const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (e) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;

      let devices;

      if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({ limit, offset });
      }
      if (brandId && !typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId },
          limit,
          offset,
        });
      }
      if (!brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId },
          limit,
          offset,
        });
      }
      if (brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId, typeId },
          limit,
          offset,
        });
      }

      return res.json(devices);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: "info" }],
      });

      if (!device) {
        return next(ApiError.notFound("Device not found"));
      }

      return res.json(device);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedDevice = await Device.destroy({ where: { id } });

      if (!deletedDevice) {
        return next(ApiError.notFound("Device not found"));
      }

      const devices = await Device.findAll();
      return res.json(devices);
    } catch (error) {
      return next(ApiError.internalServerError(error.message));
    }
  }
}

module.exports = new DeviceController();
