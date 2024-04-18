const express = require("express");
const { ObjectId } = require("mongodb");

const standardCardImageApi = (standardCardImageCollection) => {
  const standardCardImageRouter = express.Router();

  standardCardImageRouter.get("/", async (req, res) => {
    const result = await standardCardImageCollection.find().toArray();
    res.send(result);
  });

  standardCardImageRouter.post("/", async (req, res) => {
    const standardCardImage = req.body;
    const result = await standardCardImageCollection.insertOne(
      standardCardImage
    );
    res.send(result);
  });

  standardCardImageRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { standardCardImage } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateStandardCardImage = {
      $set: {
        standardCardImage: standardCardImage,
      },
    };
    const result = await standardCardImageCollection.updateOne(
      filter,
      updateStandardCardImage
    );
    res.send(result);
  });
  return standardCardImageRouter;
};

module.exports = standardCardImageApi;
