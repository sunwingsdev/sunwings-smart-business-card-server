const express = require("express");
const { ObjectId } = require("mongodb");

const bannerApi = (bannerCollection) => {
  const bannerRouter = express.Router();

  bannerRouter.get("/", async (req, res) => {
    const result = await bannerCollection.find().toArray();
    res.send(result);
  });

  bannerRouter.post("/", async (req, res) => {
    const newBanner = req.body;
    const result = await bannerCollection.insertOne(newBanner);
    res.send(result);
  });

  bannerRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { banner } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateBanner = {
      $set: {
        banner: banner,
      },
    };
    const result = await bannerCollection.updateOne(filter, updateBanner);
    res.send(result);
  });

  return bannerRouter;
};

module.exports = bannerApi;
