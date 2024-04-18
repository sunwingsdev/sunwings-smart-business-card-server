const express = require("express");
const { ObjectId } = require("mongodb");

const visitingInformationApi = (visitingInformationCollection) => {
  const visitingInformationRouter = express.Router();

  visitingInformationRouter.get("/", async (req, res) => {
    const result = await visitingInformationCollection.find().toArray();
    res.send(result);
  });

  visitingInformationRouter.post("/", async (req, res) => {
    const newInfo = req.body;
    const result = await visitingInformationCollection.insertOne(newInfo);
    res.send(result);
  });

  visitingInformationRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateInfo = req.body;
    const newInfo = {
      $set: {
        subTitle: updateInfo.subTitle,
        title: updateInfo.title,
        description: updateInfo.description,
      },
    };
    const result = await visitingInformationCollection.updateOne(
      filter,
      newInfo,
      options
    );
    res.send(result);
  });

  return visitingInformationRouter;
};

module.exports = visitingInformationApi;
