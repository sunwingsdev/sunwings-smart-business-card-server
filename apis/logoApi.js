const express = require("express");
const { ObjectId } = require("mongodb");

const logoApi = (logoCollection) => {
  const logoRouter = express.Router();

  logoRouter.get("/", async (req, res) => {
    const result = await logoCollection.find().toArray();
    res.send(result);
  });

  logoRouter.post("/", async (req, res) => {
    const newLogo = req.body;
    const result = await logoCollection.insertOne(newLogo);
    res.send(result);
  });

  logoRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { logo } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateLogo = {
      $set: {
        logo: logo,
      },
    };
    const result = await logoCollection.updateOne(filter, updateLogo);
    res.send(result);
  });
  return logoRouter;
};

module.exports = logoApi;
