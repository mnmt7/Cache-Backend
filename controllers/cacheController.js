const Cache = require("../models/cache");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.store = catchAsync(async (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined || value === null) {
    throw new AppError("Key and value are required", 400);
  }

  const cacheItem = await Cache.findOne({ key });

  if (!cacheItem) {
    // This gives the estimated count but is faster than countDocuments()
    const docCount = await Cache.estimatedDocumentCount();

    if (docCount >= process.env.CACHE_MAX_SIZE) {
      throw new AppError(
        "Cache is full. Please delete some items in order to add new items.",
        400
      );
    }
  }

  const result = await Cache.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  );

  res.status(201).json(result);
});

exports.get = catchAsync(async (req, res) => {
  const { key } = req.params;

  const cacheItem = await Cache.findOne({ key });

  if (!cacheItem) {
    throw new AppError("Cache key not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      cache: cacheItem,
    },
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { key } = req.params;
  const cacheItem = await Cache.findOneAndDelete({ key });

  if (!cacheItem) {
    throw new AppError("Cache key not found", 404);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
