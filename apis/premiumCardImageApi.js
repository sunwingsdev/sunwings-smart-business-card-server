const express = require("express");
const { ObjectId } = require("mongodb");

const premiumCardImageApi = (premiumCardImageCollection) => {
  const premiumCardImageRouter = express.Router();

  premiumCardImageRouter.get("/", async (req, res) => {
    const result = await premiumCardImageCollection.find().toArray();
    res.send(result);
  });

  premiumCardImageRouter.post("/", async (req, res) => {
    const premiumCardImage = req.body;
    const result = await premiumCardImageCollection.insertOne(premiumCardImage);
    res.send(result);
  });

  premiumCardImageRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { premiumCardImage } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatePremiumCardImage = {
      $set: {
        premiumCardImage: premiumCardImage,
      },
    };
    const result = await premiumCardImageCollection.updateOne(
      filter,
      updatePremiumCardImage
    );
    res.send(result);
  });

  return premiumCardImageRouter;
};

module.exports = premiumCardImageApi;
